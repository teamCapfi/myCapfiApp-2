import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ItemSliding } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

@IonicPage()
@Component({
  selector: 'page-select-team-mates',
  templateUrl: 'select-team-mates.html',
})
export class SelectTeamMatesPage {
  textSearchConsultant = '';
  users: Observable<any>;
  teamMembers: Array<any> = [];
  newTeamMembers: Array<any> = [];
  unchangedTeamMembers: Array<any> = [];
  formerTeamMembers : Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public myUser: UserProvider, public viewCtrl: ViewController) {
    this.teamMembers = navParams.get('teamMembers');
    this.teamMembers.forEach((element)=>{
      this.unchangedTeamMembers.push(element);
    })
  }

  ionViewDidEnter() {
    this.getListOfUsers();
  }

  getListOfUsers() {
    this.users = this.myUser.getUsers();
  }

  isInArray(array, user) {
    let isInArray: number = -1;
    array.forEach((element, index) => {
      if (user.$key == element.$key) {
        isInArray = index;
      }
    });
    return isInArray;
  }

  selectPerson(user) {
    let index1 = this.isInArray(this.teamMembers, user);
    if (index1 == -1) this.teamMembers.push(user)
    else this.teamMembers.splice(index1, 1);
  }

  deleteTeamMates(user, itemSliding: ItemSliding) {
    itemSliding.close();
    this.teamMembers.forEach((member, index) => {
      if (user.$key == member.$key) {
        this.teamMembers.splice(index, 1);
      }
    });
  }

  private _areArraysEqual(formerArray, newArray) {
    this.formerTeamMembers = [];
    this.newTeamMembers = [];
    formerArray.forEach(i => {
      let temp: boolean = false;
      newArray.forEach(j => {
        if (i.$key === j.$key) {
          temp = true;
        }
      });
      if (!temp) {
        this.formerTeamMembers.push(i);
      }
    });

    newArray.forEach(i => {
      let temp: boolean = false;
      formerArray.forEach(j => {
        if (i.$key === j.$key) {
          temp = true;
        }
      });
      if (!temp) {
        this.newTeamMembers.push(i);
      }
    });

  }


  saveTeam() {
    this._areArraysEqual(this.unchangedTeamMembers, this.teamMembers);
/*    console.log('Former', this.formerTeamMembers);
    console.log('Now', this.teamMembers);
    console.log('New', this.newTeamMembers);*/
    this.viewCtrl.dismiss({ 'teamMembers': this.teamMembers, 'newTeamMembers' : this.newTeamMembers, 'formerTeamMembers' : this.formerTeamMembers });
  }
}
