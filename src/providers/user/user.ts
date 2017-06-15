import { User } from './../interfaces/user.model';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class UserProvider {

  private _user : User;

  constructor() {
    
  }

  get user():User{
    return this._user;
  }

  set user(new_user : User){
   this._user = {
      name : new_user.name,
      email : new_user.email,
      key : new_user.key,
      family_name : new_user.family_name,
      given_name : new_user.given_name,
      photo : new_user.photo
   }
  }

  set key(new_key : string){
    this._user.key = new_key;
  }


}
