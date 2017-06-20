import { FilterPipe } from './../../pipes/filter/filter';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectTeamMatesPage } from './select-team-mates';

@NgModule({
  declarations: [
    SelectTeamMatesPage,
    FilterPipe
  ],
  imports: [
    IonicPageModule.forChild(SelectTeamMatesPage),
  ],
  exports: [
    SelectTeamMatesPage
  ]
})
export class SelectTeamMatesPageModule {}