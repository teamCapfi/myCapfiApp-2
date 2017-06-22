import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

@Injectable()
export class StorageProvider {
  constructor(private _storage: Storage) {

  }

  set(key: string, value: any): void {
    this._storage.set(key,value);
  }

  get(key : string): Promise<any>{
    return this._storage.get(key)
  }

  remove(key: string): void {
    this._storage.remove(key);
  }

  setLocalStorage(key,value): void {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  getLocalStorage(key) {
    return JSON.parse(window.localStorage.getItem(key));
  }

  removeLocalStorage(key: string): void {
    window.localStorage.removeItem(key);
  }
}
