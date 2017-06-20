import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import 'rxjs/add/operator/map';
import { AngularFireDatabase,FirebaseListObservable} from 'angularfire2/database';

import { User } from './../interfaces/user.model';
import 'rxjs/add/operator/map';

@Injectable()
export class UserProvider {
  private _infos : User;
  private _uid : string;

  constructor( private _afD : AngularFireDatabase) {
    
  }

  get infos():User{
    return this._infos;
  }
  set uid(key:string){
    this._uid = btoa(key);
  }

  set infos(new_user: User){
   this._infos = {
      name: new_user.name,
      email: new_user.email,
      key: new_user.key,
      family_name: new_user.family_name,
      given_name: new_user.given_name,
      jobTitle: "Developer",
      photo: new_user.photo,
      compagny: "Capfi",
      isManager : new_user.isManager || false,
      status : ""
   }
   this.uid = new_user.key;
  }

  getUserData(){
    this._afD.object('/users/'+ this._uid + '/identity').$ref.once('value').then((snapshot)=>{
      let user = snapshot.val()
      this._infos.email = user.email;
      this._infos.name = user.name;
      this._infos.isManager = user.isManager || false;
      this._infos.jobTitle = user.jobTitle;
      this._infos.photo = user.picture;
      this._infos.phoneNumber = user.phoneNumber;
      this._infos.status = user.status || "";
    });
  }

  set key(new_key : string){
    this._infos.key = new_key;
  }

  getUsers() : FirebaseListObservable<any>{
    return this._afD.list('/users');
  }

  updateUserData(user_data : any) : firebase.Promise<void>{
    //Save data in user service
    this._infos.isManager = user_data.isManager;
    this._infos.phoneNumber = user_data.phoneNumber;
    this._infos.status = user_data.status;
    this._infos.jobTitle = user_data.jobTitle;
    //Update data in the database
    return this._afD.object('/users/'+ this._uid + '/identity').update(user_data);
    //Save in the storage
    //TODO: see if there are useful data to save in storage
  }


}
