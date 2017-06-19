import { FilterPipe } from './../../pipes/filter/filter';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditProfilePage } from './edit-profile';

@NgModule({
  declarations: [
    EditProfilePage,
    FilterPipe
  ],
  imports: [
    IonicPageModule.forChild(EditProfilePage),
  ],
  exports: [
    EditProfilePage
  ]
})
export class EditProfilePageModule {}
