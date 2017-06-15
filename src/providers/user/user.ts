import { User } from './../interfaces/user.model';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class UserProvider {

  private _infos : User;

  constructor() {
    
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
      photo : new_user.photo
   }
  }

  set key(new_key : string){
    this._infos.key = new_key;
  }


}
