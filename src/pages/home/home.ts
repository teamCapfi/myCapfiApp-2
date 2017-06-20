import { Component } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';

import { UserProvider } from './../../providers/user/user';
import { AuthProvider } from './../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public auth: AuthProvider, public myUser: UserProvider, public modalCtrl: ModalController) {
    
  }

  logout(): void {
    this.auth.logout();
  }

  searchPage(): void {
    let modal = this.modalCtrl.create('SearchPage');
    modal.present();
  }

  editProfile(): void {
    let modal = this.modalCtrl.create('EditProfilePage');
    modal.present();
  }
}
