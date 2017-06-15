import { UserProvider } from './../../providers/user/user';
import { eMessages } from './../../environment/events/events.messages';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, Platform, Events } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  lauchLogin : boolean = false;
  errorLoginMessage : string = "";
  isAuthenticated : boolean = false;
  constructor(public navCtrl: NavController, public auth: AuthProvider, public platform: Platform, public events : Events, public myUser : UserProvider) {
    this.listenToLoginEvents();
  }

  login(){
    console.log('Launch login process..');
    this.errorLoginMessage = "";
    this.auth.login();
  }

  listenToLoginEvents(){
    this.events.subscribe(eMessages.USER_LOGIN, ()=>{
      console.log('Bienvenue', this.myUser.user.name);
      this.isAuthenticated = this.auth.isAuthenticated();
      console.log("isAuth",this.isAuthenticated);
    });
    this.events.subscribe(eMessages.USER_ERROR_LOGIN, (err)=>{
      this.errorLoginMessage = err;
      this.isAuthenticated = false;
    });
    this.events.subscribe(eMessages.USER_LOGOUT, ()=>{
      this.isAuthenticated = false;
    })
  }


}
