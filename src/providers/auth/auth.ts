import { StorageProvider } from './../storage/storage';
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

const options = {
  auth: {
      responseType: 'token',
      params: {
        scope: 'openid profile offline_access',
        device: 'my-device',
        prompt: "select_account"
      },
  },
  socialButtonStyle: 'small',
  closable: false
}
const auth0Config = {
  // needed for auth0
  clientID: auth0Vars.AUTH0_CLIENT_ID,

  // needed for auth0cordova
  clientId: auth0Vars.AUTH0_CLIENT_ID,
  domain: auth0Vars.AUTH0_DOMAIN,
  callbackURL: location.href,
  packageIdentifier: auth0Vars.PACKAGE_ID
};


@Injectable()
export class AuthProvider {
  auth0Authentication = new Auth0.Authentication({
    clientID: auth0Vars.AUTH0_CLIENT_ID,
    domain: auth0Vars.AUTH0_DOMAIN,
  });

  auth0 = new Auth0.WebAuth(auth0Config);

  public lock = new Auth0Lock(auth0Vars.AUTH0_CLIENT_ID, auth0Vars.AUTH0_DOMAIN, options);

  private accessToken: string;
  private idToken: string;
  isPlatformCordova: boolean = false;

  constructor(public zone: NgZone, public afAuth: AngularFireAuth, public platform: Platform, public events: Events, private _myUser: UserProvider, public storage : StorageProvider) {
    this.detectPlatform();

    this._initLock();
  }

  //method that listens to the event of the Auth0 lock widget
  private _initLock(): void {
    //if authentification is a success from the Auth0 side, this event is triggered
    this.lock.on('authenticated', (authResult) => {
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

  isLoggedIn(): boolean {
    let user : User = this.getStorageVariable('profile');
    this.idToken = this.getStorageVariable('id_token');
    this.accessToken = this.getStorageVariable('access_token');

    if (user && this.idToken && this.accessToken) {
      this._myUser.infos = user;
      this._myUser.getUserData();
      console.log('isLoggedIn');
      return true;
    }
    else {
      console.log('Not LoggedIn');
      return false;
    }
  }

  public loginForWeb() {
    console.log('Login For Web');
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
          error = "Ce compte n'est pas autorisé";
          this.loginErrorEvent(error);
        }
      });
  }

  private _auth_process(authResult: any) {

    this._delegation(authResult.idToken).then(()=>{
        this.setIdToken(authResult.idToken);
        this.setAccessToken(authResult.accessToken);
        //Create the user profile by calling the Auth0 API
        this.isPlatformCordova ?  this._getUserProfile() : this._setUserProfileAfterLogin(authResult.idTokenPayload);
    }).catch((err)=>{
      console.log("Delegation Error", err);
      this.loginErrorEvent(err);
    });
  }

  
  private _delegation(idToken: string):Promise<any> {

    const options = {
      id_token: idToken,
      clientID: auth0Vars.AUTH0_CLIENT_ID,
      api: 'firebase',
      scope: 'openid profile email',
      target: auth0Vars.AUTH0_CLIENT_ID,
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer'
    };
    return new Promise((resolve,reject)=>{
      this.auth0Authentication.delegation(options, (error, result) => {
        if (error) {
          error = "Oops, problème de connexion, veuillez réessayer svp";
          reject(error);
        } else {
          console.log("Delegation Success");
          this.afAuth.auth.signInWithCustomToken(result.idToken).then((data) => {
            console.log("SigninFirebase");
            resolve();
          }).catch((err) => {
            console.log("Erreur when log in the firebase system with the delegation Token", err);
            reject(err);
          })
        }
      });
    })


  }

  private _getUserProfile(){
      this.auth0.client.userInfo(this.accessToken, (err, profile) => {
        if(err) {
          throw err;
        }

        profile.user_metadata = profile.user_metadata || {};
        this.setStorageVariable('profile', profile);
        this.zone.run(() => {
          this._setUserProfileAfterLogin(profile);
        });
      });
  }

  //Create the user profile by calling the Auth0 API
  private _setUserProfileAfterLogin(userInfo : any) {
    let newUser: User = {
        name: userInfo.name,
        email: userInfo.email,
        key: userInfo.identities[0].user_id,
        family_name: userInfo.family_name || "",
        given_name: userInfo.given_name || "",
        photo: userInfo.picture
      }
      this._myUser.infos = newUser;
      this.setStorageVariable('profile', newUser);
      this.loginEvent();
  }


  public logoutEvent() {
    this.events.publish(eMessages.USER_LOGOUT);
  }

  public loginEvent() {
    console.log('In loginEvents');
    this.zone.run(()=>{
      this.events.publish(eMessages.USER_LOGIN);
    })
  }

  public loginErrorEvent(err) {
    this.events.publish(eMessages.USER_ERROR_LOGIN, err);
  }

  private _removeStorage() {
    this.storage.removeLocalStorage('profile');
    this.storage.removeLocalStorage('access_token');
    this.storage.removeLocalStorage('id_token');
  
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
