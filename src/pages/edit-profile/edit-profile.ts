import { eMessages } from './../../environment/events/events.messages';
import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';



@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  editForm : FormGroup;
  teamMembers : Array<any> = [];
  newTeamMembers : Array<any> = [];
  formerTeamMembers : Array<any> = [];
  teamMembersSubscription : any;

  constructor(
   public navCtrl: NavController,
   public navParams: NavParams, 
   public viewCtrl : ViewController, 
   public myUser : UserProvider, 
   private fb : FormBuilder, 
   public modalCtrl : ModalController,
   public toastCtrl : ToastController) {

    this.initComponent();
  }

  initComponent(){
    this.createForm();
    this.getTeam();
  }

  createForm(){
    this.editForm = this.fb.group({
      jobTitle : this.myUser.infos.jobTitle || "",
      status : this.myUser.infos.status || 'En mission',
      phoneNumber : this.myUser.infos.phoneNumber || "",
      isManager : this.myUser.infos.isManager
    })
  }

  getTeam(){
    this.teamMembersSubscription = this.myUser.getTeam().subscribe((users)=>{
      users.forEach(userInfo => {
        userInfo.data.subscribe((item)=>{
        this.teamMembers.push(item);
      })
      });
    });
  }

  addInTeam(){
    let modal = this.modalCtrl.create('SelectTeamMatesPage',{'teamMembers': this.teamMembers});
    modal.present();

    modal.onDidDismiss((data)=>{
      if(data){
        this.teamMembers = data.teamMembers;
        this.formerTeamMembers = data.formerTeamMembers;
        this.newTeamMembers = data.newTeamMembers;
      }
    })
  }


  onSubmit(){
    this.myUser.updateUserData(this.editForm.value,this.formerTeamMembers, this.teamMembers, this.newTeamMembers).then(()=>{
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

  ionViewWillLeave(){
    this.teamMembersSubscription.unsubscribe();
  }


}
