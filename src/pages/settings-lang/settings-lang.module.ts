import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsLangPage } from './settings-lang';

@NgModule({
  declarations: [
    SettingsLangPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsLangPage),
  ],
})
export class SettingsLangPageModule {}
