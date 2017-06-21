import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VisitedProfilePage } from './visited-profile';

@NgModule({
  declarations: [
    VisitedProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(VisitedProfilePage),
  ],
  exports: [
    VisitedProfilePage
  ]
})
export class VisitedProfilePageModule {}
