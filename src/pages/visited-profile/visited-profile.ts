import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-visited-profile',
  templateUrl: 'visited-profile.html',
})
export class VisitedProfilePage {
  private _user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this._user = navParams.get('user');
  }

  ionViewDidLoad(): void {
    console.log('ionViewDidLoad VisitedProfilePage');
  }
}
