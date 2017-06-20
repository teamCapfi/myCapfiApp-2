import { Injectable } from '@angular/core';

import { AngularFireDatabase,FirebaseListObservable,FirebaseObjectObservable} from 'angularfire2/database';

import { User } from './../interfaces/user.model';
import 'rxjs/add/operator/map';

@Injectable()
export class UserProvider {
  private _infos : User;

  constructor( private _afD : AngularFireDatabase) {
    
  }

  get infos():User{
    return this._infos;
  }

  set infos(new_user: User){
   this._infos = {
      name: new_user.name,
      email: new_user.email,
      key: new_user.key,
      phoneNumber: "0615032255",
      family_name: new_user.family_name,
      given_name: new_user.given_name,
      photo: new_user.photo,
      jobTitle: "Developer",
      compagny: "Capfi",
      status: "Disponible",
      isManager : new_user.isManager || false
   }
  }

  set key(new_key : string){
    this._infos.key = new_key;
  }

  getUsers() : FirebaseListObservable<any>{
    return this._afD.list('/users');
  }
}
