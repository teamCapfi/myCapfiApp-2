import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { User } from './../interfaces/user.model';

@Injectable()
export class UserProvider {
  private _infos: User;
  private _uid: string;
  private _teamKey: string;

  constructor(private _afD: AngularFireDatabase) {

  }

  get infos(): User {
    return this._infos;
  }
  
  set uid(key: string) {
    this._uid = btoa(key);
  }

  get teamKey(): string {
    return this._teamKey;
  }

  set teamKey(tK: string) {
    this._teamKey = tK;
  }

  get uid(): string {
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
      company: "",
      isManager : new_user.isManager || false,
      status : ""
   }
   this.uid = new_user.key;
  }

  getUserData(): void {
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

  getUsers(): Observable<any> {
    // relative URL, uses the database url provided in bootstrap
    return this._afD.list('/users').map((users) => {
      const list_without_myUser = users.filter((user) => user.identity.user_id != this.infos.key)
      return list_without_myUser;
    });;
  }

  updateUserData(user_data: any, formerTeamMembers?: Array<any>, teamMembers?: Array<any>, newTeamMembers?: Array<any>): any {
    //Save data in user service
    console.log(user_data);

    this._infos.isManager = user_data.isManager;
    this._infos.phoneNumber = user_data.phoneNumber;
    this._infos.status = user_data.status;
    this._infos.jobTitle = user_data.jobTitle;

    this._afD.object('/users/' + this._uid + '/identity').update(user_data);
    //Save in the storage
    //TODO: see if there are useful data to save in storage
    if (this.infos.isManager) {
      if (this.teamKey === "") {
        return this.createTeam(teamMembers).catch((err) => {
          console.log(err);
        });
      } else {
        return this.updateTeamMembers(formerTeamMembers, teamMembers, newTeamMembers);
      }
    }

  }

  getTeam() {
    return this._afD.list(`/teams/${this.teamKey}`).map((items) => {
      return items.map(item => {
        item.data = this._afD.object(`/users/${item.$key}`);
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

  private _extractKeys(teamMembers): Object {
    let teamMembersKey: Object = {};
    if (teamMembers.length != 0) {
      teamMembers.forEach((teamMember) => {
        teamMembersKey[teamMember.$key] = true
      })
    }
    return teamMembersKey;
  }

  updateTeamMembers(formerTeamMembers: Array<any>, teamMembers: Array<any>, newTeamMembers: Array<any>, ) {
    let TeamMembersKey: Object = {};
      TeamMembersKey = this._extractKeys(teamMembers);
      if (this.teamKey != "") return this._afD.object(`/teams/${this.teamKey}`).set(TeamMembersKey).then(() => {
        if(Object.keys(TeamMembersKey).length === 0) this.teamKey = "";
        if(newTeamMembers.length != 0){
          newTeamMembers.forEach(newTeamMemb => {
            this._afD.object(`/users/${newTeamMemb.$key}`).update({ 'teamKey': this.teamKey })
          });
        }
        if(formerTeamMembers.length != 0){
          formerTeamMembers.forEach(formerTeamMemb => {
            this._afD.object(`/users/${formerTeamMemb.$key}/teamKey`).remove();
          });
        }
      });
  }

  createTeam(teamMembers: Array<any>) {
    let teamMembersKey: Object = this._extractKeys(teamMembers);
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
            this.teamKey = new_team.key;
            resolve('Team Created');
          }).catch((err) => {
            reject(err);
          })
        }).catch((err) => {
          reject(err);
        })
      }
    })
  }
}
