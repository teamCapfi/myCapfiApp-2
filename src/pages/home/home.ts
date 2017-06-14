import { eMessages } from './../../environment/events/events.messages';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, Platform, Events } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  isPlatformCordova: boolean = false;
  lauchLogin : boolean = false;
  errorLoginMessage : string = "";
  constructor(public navCtrl: NavController, public auth: AuthProvider, public platform: Platform, public events : Events) {
    this.listenToLoginEvents()
  }

  ionViewDidLoad() {
    this.detectPlatform();
    console.log(this.isPlatformCordova);
  }

  login(){
    console.log(this.isPlatformCordova);
    this.lauchLogin = true;
    if(this.isPlatformCordova) this.auth.loginForCordova();
    else this.auth.loginForWeb();
  }

  listenToLoginEvents(){
    this.events.subscribe(eMessages.USER_LOGIN, ()=>{
      this.lauchLogin = false;
    });
    this.events.subscribe(eMessages.USER_ERROR_LOGIN, (err)=>{
      this.errorLoginMessage = err;
      this.lauchLogin = false;
    })
  }

  detectPlatform() {
    this.platform.ready().then((readySource) => {
      console.log(readySource);
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

}
