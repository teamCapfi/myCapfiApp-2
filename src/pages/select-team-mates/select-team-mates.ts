import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-select-team-mates',
  templateUrl: 'select-team-mates.html',
})
export class SelectTeamMatesPage {
  textSearchConsultant = '';
  users : Observable<any>;
  teamMembers : Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public myUser : UserProvider, public viewCtrl : ViewController) {
  
  }

  ionViewDidEnter(){
    this.getListOfUsers();
  }

    getListOfUsers(){
    this.users = this.myUser.getUsers().map((users)=>{
      const list_without_myUser = users.filter((user)=>user.identity.user_id != this.myUser.infos.key)
      return list_without_myUser;
    });
  }

  selectPerson(user){
  }


}
