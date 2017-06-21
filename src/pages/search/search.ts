import { Component } from '@angular/core';
import { IonicPage, ModalController, ViewController } from 'ionic-angular';

import { FirebaseListObservable } from 'angularfire2/database';
import { Subscription} from 'rxjs/Subscription';

import { UserProvider } from './../../providers/user/user';
import { AuthProvider } from './../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  private _itemsList: FirebaseListObservable<any>;
  private _loadedUsersList:Array<any>;
  private _usersList:Array<any>;
  private _disconnected: Subscription;
  private _inSearchBar: boolean = false;

  constructor(public auth: AuthProvider, public myUser: UserProvider, public modalCtrl: ModalController, public viewCtrl : ViewController) {
    let items = [];

    this._itemsList = myUser.getUsers();
    this._disconnected = this._itemsList.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        if(snapshot.val().identity.email != myUser.infos.email) {
          items.push(snapshot.val())
          console.log(snapshot.val())
        }
      });
      this._usersList = items;
      this._loadedUsersList = items;
      this.initializeItems();
    });
  }

  initializeItems(): void {
    this._usersList = this._loadedUsersList; 
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

    this._usersList = this._usersList.filter((v) => {
      if(v.identity.name && q) {
        if (v.identity.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });

    //console.log(q, this._usersList.length);
  }

  ionViewWillLeave(): void {
    this._disconnected.unsubscribe();
  }
}
