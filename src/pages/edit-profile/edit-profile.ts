import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';


@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  editForm : FormGroup;
  textSearchConsultant = '';
  users : Observable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl : ViewController, public myUser : UserProvider, private fb : FormBuilder) {
    this.initComponent();
    console.log('myUser', this.myUser.infos);
  }

  initComponent(){
    this.createForm();
    this.getListOfUsers();
  }

  createForm(){
    this.editForm = this.fb.group({
      jobTitle : this.myUser.infos.jobTitle,
      statut : this.myUser.infos.status || 'En mission',
      tel : this.myUser.infos.phoneNumber,
      isManager : this.myUser.infos.isManager
    })
  }

  getListOfUsers(){
    this.users = this.myUser.getUsers().map((users)=>{
      const list_without_myUser = users.filter((user)=>user.identity.user_id != this.myUser.infos.key)
      return list_without_myUser;
    });
  }

  onSearch(){

  }

}
