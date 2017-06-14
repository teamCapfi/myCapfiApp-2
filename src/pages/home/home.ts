import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private isPlatformCordova: boolean = false;

  constructor(public navCtrl: NavController, public auth: AuthProvider, public platform: Platform) {

  }

  detectPlatform(readySource) {
    this.platform.ready().then((readySource) => {
      switch (readySource) {
        case 'dom':
          this.isPlatformCordova = false;
        case 'cordova':
          this.isPlatformCordova = true;
      }
    })
  }

}
