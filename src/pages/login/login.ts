import { UserProvider } from './../../providers/user/user';
import { eMessages } from './../../environment/events/events.messages';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, Events, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  errorLoginMessage : string = "";
  launchLoadingprocess : boolean = false;
  constructor(public navCtrl: NavController,public navParmas : NavParams, public auth : AuthProvider, public events : Events, public myUser : UserProvider) {
    this.errorLoginMessage = navParmas.get('errorLogin');
    if(this.errorLoginMessage) this.launchLoadingprocess = false;
  }


  login(){
    this.launchLoadingprocess = true;
    this.errorLoginMessage = "";
    this.auth.login();
  }


}
