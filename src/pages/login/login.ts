import { Component } from '@angular/core';
import { IonicPage, NavController, Events, NavParams } from 'ionic-angular';

import { UserProvider } from './../../providers/user/user';
import { AuthProvider } from './../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  errorLoginMessage : string = "";
  launchLoadingprocess : boolean = false;
  constructor(public navCtrl: NavController,public navParmas : NavParams, public auth : AuthProvider, public events : Events, public myUser : UserProvider) {
    this.errorLoginMessage = navParmas.get("errorLogin");
    if(this.errorLoginMessage) this.launchLoadingprocess = false;
  }

  login(): void {
    this.launchLoadingprocess = true;
    this.errorLoginMessage = "";
    this.auth.login();
  }

  stopLogin(): void {
    this.launchLoadingprocess = false;
  }


}
