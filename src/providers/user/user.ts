import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { User } from './../interfaces/user.model';
import 'rxjs/add/operator/map';

@Injectable()
export class UserProvider {
  private _infos: User;
  private _uid: string;
  private _teamKey : string;

  constructor(private _afD: AngularFireDatabase) {

  }

  get infos(): User {
    return this._infos;
  }
  set uid(key: string) {
    this._uid = btoa(key);
  }

  get teamKey(): string{
    return this._teamKey;
  }

  set teamKey(tK : string){
    this._teamKey = tK;
  }

  get uid():string{
    return this._uid;
  }

  set infos(new_user: User) {
    this._infos = {
      name: new_user.name,
      email: new_user.email,
      key: new_user.key,
      family_name: new_user.family_name,
      given_name: new_user.given_name,
      jobTitle: "",
      photo: new_user.photo,
      compagny: "Capfi",
      isManager: new_user.isManager || false,
      status: ""
    }
    this.uid = new_user.key;
  }

  getUserData() {
    this._afD.object('/users/' + this.uid).$ref.once('value').then((snapshot) => {
      let user = snapshot.val().identity;
      this._infos.email = user.email;
      this._infos.name = user.name;
      this._infos.isManager = user.isManager || false;
      this._infos.jobTitle = user.jobTitle;
      this._infos.photo = user.picture;
      this._infos.phoneNumber = user.phoneNumber;
      this._infos.status = user.status || "";
      this.teamKey = snapshot.val().teamKey || "";
    });
  }

  set key(new_key: string) {
    this._infos.key = new_key;
  }

  getUsers(): FirebaseListObservable<any> {
    return this._afD.list('/users');
  }

  updateUserData(user_data: any): firebase.Promise<void> {
    //Save data in user service
    this._infos.isManager = user_data.isManager;
    this._infos.phoneNumber = user_data.phoneNumber;
    this._infos.status = user_data.status;
    this._infos.jobTitle = user_data.jobTitle;
    //Update data in the database
    return this._afD.object('/users/' + this._uid + '/identity').update(user_data);
    //Save in the storage
    //TODO: see if there are useful data to save in storage
  }

  getTeam(){
    return this._afD.list(`/teams/${this.teamKey}`).map((items) => {
      return items.map(item => {
        item.data =  this._afD.object(`/users/${item.$key}`);
        return item;
      });
    });
  }

/*  getTeam():Promise<any>{
    let teamMembers : Array<any> = [];
    return new Promise((resolve,reject)=>{
      if(!this.infos.isManager) reject("Vous n'êtes pas un manager");
      else if (this.teamKey == "") reject("Vous n'êtes pas dans une équipe");
      else{
        let teamRef = this._afD.list(`/teams/${this.teamKey}`).$ref;
        teamRef.once('value').then(snapshot=>{
          Object.keys(snapshot).forEach((key,index)=>{
            this._afD.list(`/users/${key}/identity`).$ref.once('value').then((user_info)=>{
              teamMembers.push(user_info);
            }).catch((err)=>{
              reject(err);
            })
          })
        });
      }
    })
  }*/

  updateTeamMember(newTeamMembers : Array<any>, formerTeamMembers : Array<any>){

  }

  createTeam(teamMembers: Array<any>) {
    let teamMembersKey: Object = {};
    if (teamMembers.length != 0) {
      teamMembers.forEach((teamMember) => {
        teamMembersKey[teamMember.$key] = true
      })
    }
    return new Promise((resolve, reject) => {
      if (!this.infos.isManager) reject("Vous n'êtes pas manager");
      else {
        this._afD.list('/teams').push(teamMembersKey).then((new_team) => {
          teamMembers.forEach((teamMember => {
            this._afD.object('/users/' + teamMember.$key).update({ 'teamKey': new_team.key }).catch((err) => {
              reject(err);
            });
          }));
          this._afD.object('/users/' + this.uid).update({ "teamKey": new_team.key }).then(() => {
            resolve('Team Created');
          }).catch((err) => {
            reject(err);
          })
        }).catch((err)=>{
          reject(err);
        })
      }
    })
  }
}
