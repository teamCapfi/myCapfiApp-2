import { eMessages } from './../environment/events/events.messages';
import { AuthProvider } from './../providers/auth/auth';
import { Component, ViewChild } from '@angular/core';
import { Platform, Events, Nav, } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import Auth0Cordova from '@auth0/cordova';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public auth : AuthProvider, public events : Events) {
    platform.ready().then((readySource) => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      //splashScreen.hide();

    (<any>window).handleOpenURL = (url) => {
        Auth0Cordova.onRedirectUri(url);
    };

    this.listenTologinEvents();
      this.auth.isLoggedIn() ? this.rootPage = 'HomePage' : this.rootPage = "LoginPage";
    });
  }

  listenTologinEvents(){
    this.events.subscribe(eMessages.USER_LOGIN, ()=>{
      this.nav.setRoot('HomePage');
    });
    this.events.subscribe(eMessages.USER_LOGOUT, ()=>{
      this.nav.setRoot('LoginPage');
    })
  }
}

