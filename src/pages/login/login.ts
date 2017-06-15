import { UserProvider } from './../../providers/user/user';
import { eMessages } from './../../environment/events/events.messages';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  errorLoginMessage : string = "";
  launchLoadingprocess : boolean = false;
  constructor(public navCtrl: NavController, public auth : AuthProvider, public events : Events, public myUser : UserProvider) {
    this.listenToLoginEvents();
  }


  login(){
    this.launchLoadingprocess = true;
    this.errorLoginMessage = "";
    this.auth.login();
  }

  listenToLoginEvents(){
    this.events.subscribe(eMessages.USER_LOGIN, ()=>{
      this.navCtrl.setRoot('HomePage');
    });
    this.events.subscribe(eMessages.USER_ERROR_LOGIN, (err)=>{
      this.errorLoginMessage = err;
      this.launchLoadingprocess = false;
    });
  }

}
