import { eMessages } from './../../environment/events/events.messages';
import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';



@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  editForm : FormGroup;

  constructor(
   public navCtrl: NavController,
   public navParams: NavParams, 
   public viewCtrl : ViewController, 
   public myUser : UserProvider, 
   private fb : FormBuilder, 
   public modalCtrl : ModalController,
   public toastCtrl : ToastController) {

    this.initComponent();
    console.log('user', this.myUser.infos);
  }

  initComponent(){
    this.createForm();
  }

  createForm(){
    this.editForm = this.fb.group({
      jobTitle : this.myUser.infos.jobTitle || "",
      status : this.myUser.infos.status || 'En mission',
      phoneNumber : this.myUser.infos.phoneNumber || "",
      isManager : this.myUser.infos.isManager
    })
  }

  addInTeam(){
    let modal = this.modalCtrl.create('SelectTeamMatesPage');
    modal.present();

  }

  onSubmit(){
    this.myUser.updateUserData(this.editForm.value).then(()=>{
      this.presentToast(eMessages.SUCCESS_UPDATE_PROFILE);
      this.viewCtrl.dismiss();
    }).catch(()=>{
      this.presentToast(eMessages.FAILURE_UPDATE_PROFILE);
    })
  }

  presentToast(message : string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }


}
