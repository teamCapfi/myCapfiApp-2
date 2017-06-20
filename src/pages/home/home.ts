import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { Subscription} from 'rxjs/Subscription';

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

  logout() {
      this.auth.logout();
  }

  searchPage() {
    let modal = this.modalCtrl.create('SearchPage');
    modal.present();
  }

  editProfile() {
    let modal = this.modalCtrl.create('EditProfilePage');
    modal.present();
  }
}
