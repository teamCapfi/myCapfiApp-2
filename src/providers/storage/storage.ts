import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';


@Injectable()
export class StorageProvider {

  constructor(private _storage : Storage) {
  }

  set(key : string, value : any){
    this._storage.set(key,value);
  }

  get(key : string):Promise<any>{
    return this._storage.get(key)
  }

  remove(key : string){
    this._storage.remove(key);
  }

  setLocalStorage(key,value){
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  getLocalStorage(key){
    return JSON.parse(window.localStorage.getItem(key));
  }

  removeLocalStorage(key : string){
    window.localStorage.removeItem(key);
  }


}
