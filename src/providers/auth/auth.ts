import { Platform } from 'ionic-angular';
import { auth0Vars } from './../../environment/auth0/auth0.variables';
import { Injectable, NgZone } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
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

  private currentUser: firebase.User;

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

  accessToken: string;
  idToken: string;
  user: any;

  constructor(public zone: NgZone, public afAuth: AngularFireAuth, public platform : Platform) {
    this.user = this.getStorageVariable('profile');
    this.idToken = this.getStorageVariable('id_token');

    afAuth.auth.onAuthStateChanged((user) => {
      console.log("Current user", user);
      this.currentUser = user;
    });

    this._initLock();
  }

  //method that listens to the event of the Auth0 lock widget
  private _initLock(): void {
    //if authentification is a success from the Auth0 side, this event is triggered
    this.lock.on('authenticated', (authResult) => {
      console.log('authResult',authResult.accessToken);
      this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) return;

      this._delegation(authResult.idToken);
      });
    });

    //Event triggered when the authorization failed from the Auth0 side.
    this.lock.on('authorization_error', (error) => {
      console.log("Authorization error", error);
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

  public isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return Date.now() < expiresAt;
  }

  public loginForWeb(){
    this.lock.show();
  }

  public loginForCordova() {
    const client = new Auth0Cordova(auth0Config);

    const options = {
      scope: 'openid profile offline_access'
    };

    client.authorize(options, (err, authResult) => {
      if (err) {
        console.error("Erreur",err);
        return;
      }

      this._delegation(authResult.idToken);

      this.setIdToken(authResult.idToken);
      this.setAccessToken(authResult.accessToken);

      const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
      this.setStorageVariable('expires_at', expiresAt);

      // this._firebaseAuthentication(authResult.idToken);

      this.auth0.client.userInfo(this.accessToken, (err, profile) => {
        if (err) {
          console.log(err);
          this.logout();
          return;
        }

        profile.user_metadata = profile.user_metadata || {};
        this.setStorageVariable('profile', profile);
        this.zone.run(() => {
          this.user = profile;
        });
      });
    });
  }

  private _delegation(idToken: string) {
    const options = {
      id_token: idToken,
      clientID: auth0Vars.AUTH0_CLIENT_ID,
      api: 'firebase',
      scope: 'openid profile email',
      target: auth0Vars.AUTH0_CLIENT_ID,
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer'
    };

    this.auth0Authentication.delegation(options, (error, result) => {
      console.log("Result delegation", result);
      if (error) {
        console.log(error);
        return;
      }else{
          this.afAuth.auth.signInWithCustomToken(result.idToken).then((data) => {
            console.log("User data", data);
        }).catch((err) => {
          console.log("Erreur when log in the firebase system with the delegation Token", err);
        })
      }
    })
  }


  public logout() {
    this.afAuth.auth.signOut().then(() => {
      console.log("Successfully signed out");
      window.localStorage.removeItem('profile');
      window.localStorage.removeItem('access_token');
      window.localStorage.removeItem('id_token');
      window.localStorage.removeItem('expires_at');

      this.idToken = null;
      this.accessToken = null;
      this.user = null;
    }).catch((err) => {
      console.log("Error when signing out", err);
    })

  }


}
