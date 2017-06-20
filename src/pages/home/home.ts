import { Component } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

import { UserProvider } from './../../providers/user/user';
import { AuthProvider } from './../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  items: FirebaseObjectObservable<any>;
  public loadedUserList:Array<any>;
  //public userInfo: firebase.database.Reference;

  constructor(public auth: AuthProvider, public myUser: UserProvider, public modalCtrl: ModalController, db: AngularFireDatabase) {
    console.log(myUser.infos);
    // relative URL, uses the database url provided in bootstrap
    // console.log(btoa(this.myUser.key));
    // this.items = db.object('/users/'+ btoa(this.myUser.key), { preserveSnapshot: true });
    // this.items.subscribe(snapshot => {
    //   console.log(snapshot.key)
    //   console.log(snapshot.val())
    // });

    /*this.items.$ref.on('value', userList => {
      let users = [];
      userList.forEach( user => {
        users.push(user.val());
        return false;
      });

      //this.item = users;
      //this.loadedUserList = users;
    });*/
  }

  /*initializeItems(): void {
    this.userList = this.loadedUserList;
  }

  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();
    
    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }

    this.userList = this.userList.filter((v) => {
      if(v.identity.nickname && q) {
        if (v.identity.nickname.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });

    console.log(q, this.userList.length);

  }*/


  logout(){
      this.auth.logout();
  }

  editProfile(){
    let modal = this.modalCtrl.create('EditProfilePage');
    modal.present();
  }
}
