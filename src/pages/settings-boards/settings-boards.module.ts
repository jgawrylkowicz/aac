import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsBoardsPage } from './settings-boards';

@NgModule({
  declarations: [
    SettingsBoardsPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsBoardsPage),
  ],
})
export class SettingsBoardsPageModule {}
