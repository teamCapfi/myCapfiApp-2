import { UserProvider } from './../../providers/user/user';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, Platform, Events, IonicPage, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  lauchLogin : boolean = false;
  errorLoginMessage : string = "";
  constructor(public navCtrl: NavController, public auth: AuthProvider, public platform: Platform, public events : Events, public myUser : UserProvider, public modalCtrl : ModalController) {
  }

  logout(){
      this.auth.logout();
  }

  editProfile(){
    let modal = this.modalCtrl.create('EditProfilePage');
    modal.present();
  }


}
