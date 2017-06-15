import { eMessages } from './../../environment/events/events.messages';
import { UserProvider } from './../../providers/user/user';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, Platform, Events, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  lauchLogin : boolean = false;
  errorLoginMessage : string = "";
  constructor(public navCtrl: NavController, public auth: AuthProvider, public platform: Platform, public events : Events, public myUser : UserProvider) {
    this.listenToEvents()
  }


  logout(){
      this.auth.logout();
  }

  listenToEvents(){
    this.events.subscribe(eMessages.USER_LOGOUT, ()=>{
      this.navCtrl.setRoot('LoginPage');
    })
  }

}
