import { User } from './../interfaces/user.model';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireDatabase,FirebaseListObservable,FirebaseObjectObservable} from 'angularfire2/database';


@Injectable()
export class UserProvider {

  private _infos : User;

  constructor( private _afD : AngularFireDatabase) {
    
  }

  get infos():User{
    return this._infos;
  }

  set infos(new_user : User){
   this._infos = {
      name : new_user.name,
      email : new_user.email,
      key : new_user.key,
      family_name : new_user.family_name,
      given_name : new_user.given_name,
      photo : new_user.photo,
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
