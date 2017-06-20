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

  constructor(public navCtrl: NavController, public navParams: NavParams, public myUser: UserProvider, public viewCtrl: ViewController) {
    console.log(navParams.get('teamMembers'));
    this.teamMembers = navParams.get('teamMembers');
  }

  ionViewDidEnter() {
    this.getListOfUsers();
  }

  getListOfUsers() {
    this.users = this.myUser.getUsers().map((users) => {
      const list_without_myUser = users.filter((user) => user.identity.user_id != this.myUser.infos.key)
      return list_without_myUser;
    });
  }

  selectPerson(user) {
    let isInTeam: boolean = false;
    this.teamMembers.forEach((member, index) => {
      if (user.$key == member.$key) {
        isInTeam = true;
        this.teamMembers.splice(index, 1);
      }
    });
    if (!isInTeam) this.teamMembers.push(user);
  }

  deleteTeamMates(user, itemSliding : ItemSliding) {
    itemSliding.close();
    this.teamMembers.forEach((member, index) => {
      if (user.$key == member.$key) {
        this.teamMembers.splice(index, 1);
      }
    });
  }


  saveTeam() {
/*    this.myUser.createTeam(this.teamMembers).then((data)=>{
      console.log(data);
    }).catch((err)=>{
      console.log(err);
    })*/
    this.viewCtrl.dismiss({ 'teamMembers': this.teamMembers });
  }
}
