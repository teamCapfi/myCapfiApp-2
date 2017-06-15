import { UserProvider } from './../user/user';
import { User } from './../interfaces/user.model';
import { eMessages } from './../../environment/events/events.messages';
import { Platform, Events } from 'ionic-angular';
import { auth0Vars } from './../../environment/auth0/auth0.variables';
import { Injectable, NgZone } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import Auth0Cordova from '@auth0/cordova';
import Auth0 from 'auth0-js';


declare var Auth0Lock: any;

const auth0Config = {
  // needed for auth0
  clientID: auth0Vars.AUTH0_CLIENT_ID,

  // needed for auth0cordova
  clientId: auth0Vars.AUTH0_CLIENT_ID,
  domain: auth0Vars.AUTH0_DOMAIN,
  callbackURL: location.href,
  packageIdentifier: auth0Vars.PACKAGE_ID,
};


@Injectable()
export class AuthProvider {


  auth0Authentication = new Auth0.Authentication({
    clientID: auth0Vars.AUTH0_CLIENT_ID,
    domain: auth0Vars.AUTH0_DOMAIN,
  });

  auth0 = new Auth0.WebAuth(auth0Config);

  public lock = new Auth0Lock(auth0Vars.AUTH0_CLIENT_ID, auth0Vars.AUTH0_DOMAIN, {
    auth: {
      responseType: 'token',
      params: {
        scope: 'openid profile offline_access',
        device: 'my-device'
      },
    },
    /*theme: {
      logo: '../assets/icon/capfiLogo.png'
    },*/
    socialButtonStyle: 'small',
    closable: false
  });

  private accessToken: string;
  private idToken: string;
  isPlatformCordova: boolean = false;
  isLoggedIn: boolean = false;

  constructor(public zone: NgZone, public afAuth: AngularFireAuth, public platform: Platform, public events: Events, private _myUser: UserProvider) {
    this.detectPlatform().then(() => {
      this.isAlreadyLoggedIn();
    });

    this._initLock();
  }

  //method that listens to the event of the Auth0 lock widget
  private _initLock(): void {
    //if authentification is a success from the Auth0 side, this event is triggered
    this.lock.on('authenticated', (authResult) => {
      console.log('authenticated');
      this._auth_process(authResult);
    });

    //Event triggered when the authorization failed from the Auth0 side.
    this.lock.on('authorization_error', (error) => {
      console.log("Authorization error", error);
      this.loginErrorEvent(error.error_description);
    })
  }

  private getStorageVariable(name) {
    return JSON.parse(window.localStorage.getItem(name));
  }

  private setStorageVariable(name, data) {
    window.localStorage.setItem(name, JSON.stringify(data));
  }

  private setIdToken(token) {
    this.idToken = token;
    this.setStorageVariable('id_token', token);
  }

  private setAccessToken(token) {
    this.accessToken = token;
    this.setStorageVariable('access_token', token);
  }

  public isAuthenticated(): boolean {
    if (this.isLoggedIn) return true;
    else return false;
  }

  public detectPlatform() {
    return this.platform.ready().then((readySource) => {
      switch (readySource) {
        case 'dom':
          this.isPlatformCordova = false;
          break;
        case 'cordova':
          this.isPlatformCordova = true;
          break;
      }
    })
  }

  isAlreadyLoggedIn(): void {
    let user: User;
    user = this.getStorageVariable('profile');
    this.idToken = this.getStorageVariable('id_token');
    this.accessToken = this.getStorageVariable('access_token');
    if (user && this.idToken && this.accessToken) {
      this._myUser.user = user;
      this.isLoggedIn = true;
    }
    else {
      this.isLoggedIn = false;
    }
  }

  public loginForWeb() {
    this.lock.show();
  }

  public login() {
    this.isPlatformCordova ? this.loginForCordova() : this.loginForWeb();
  }

  public loginForCordova() {

    let client = new Auth0Cordova(auth0Config);

    const options = {
      scope: 'openid profile offline_access'
    };

    client.authorize(options, (err, authResult) => {

      try {
        if (err) throw new Error(err);
        this._auth_process(authResult);

      } catch (error) {

        console.log("Error at client auth", error);
        this.loginErrorEvent(error);
      }
    });
  }

  private _auth_process(authResult: any) {

    console.log('AuthProcess');
    this._delegation(authResult.idToken);

    this.setIdToken(authResult.idToken);
    this.setAccessToken(authResult.accessToken);
    //Create the user profile by calling the Auth0 API
    this._setUserProfileAfterLogin();

  }

  
  private _delegation(idToken: string) {

    console.log("delegation");
    const options = {
      id_token: idToken,
      clientID: auth0Vars.AUTH0_CLIENT_ID,
      api: 'firebase',
      scope: 'openid profile email',
      target: auth0Vars.AUTH0_CLIENT_ID,
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer'
    };

    this.auth0Authentication.delegation(options, (error, result) => {
      if (error) {
        console.log(error);
        return;
      } else {
        console.log("Delegation Success")
        this.afAuth.auth.signInWithCustomToken(result.idToken).then((data) => {
          console.log("SigninFirebase");
        }).catch((err) => {
          console.log("Erreur when log in the firebase system with the delegation Token", err);
        })
      }
    })
  }

  //Create the user profile by calling the Auth0 API
  private _setUserProfileAfterLogin() {
    this.auth0.client.userInfo(this.accessToken, (err, profile) => {
      if (err) {
        console.log(err);
        this._removeStorage();
        return;
      }

      console.log("GetUserProfile");
      let newUser: User = {
        name: profile.name,
        email: profile.email,
        key: profile.identities[0].user_id,
        family_name: profile.family_name || "",
        given_name: profile.given_name || "",
        photo: profile.picture
      }

      this._myUser.user = newUser;
      this.loginEvent();
      this.setStorageVariable('profile', newUser);

    });
  }


  public logoutEvent() {
    this.isLoggedIn = false;
    this.events.publish(eMessages.USER_LOGOUT);
  }

  public loginEvent() {
    this.isLoggedIn = true;
    this.events.publish(eMessages.USER_LOGIN);
  }

  public loginErrorEvent(err) {
    this.events.publish(eMessages.USER_ERROR_LOGIN, err);
  }

  private _removeStorage() {
    window.localStorage.removeItem('profile');
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('id_token');

    this.idToken = null;
    this.accessToken = null;
  }

  public logout() {
    this.afAuth.auth.signOut().then(() => {
      console.log("Successfully signed out");
      this._removeStorage();
      this.logoutEvent();
    }).catch((err) => {
      console.log("Error when signing out", err);
    })

  }
}
