import { Env } from './../environment/environment';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import Auth0Cordova from '@auth0/cordova';
import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then((readySource) => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.detectPlatform(readySource);
      statusBar.styleDefault();
      splashScreen.hide();

    (<any>window).handleOpenURL = (url) => {
      (<any>window).setTimeout(function () {
        Auth0Cordova.onRedirectUri(url);
      }, 100);
    };
    });
  }

  detectPlatform(readySource){
      switch (readySource) {
        case 'dom':
          Env.platform = "dom";
        case 'cordova':
          Env.platform = "cordova";
        default:
          Env.platform = "dom";;
      }
  }
}

