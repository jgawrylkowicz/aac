import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPanePage } from './settings-pane';

@NgModule({
  declarations: [
    SettingsPanePage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsPanePage),
  ],
})
export class SettingsPanePageModule {}
