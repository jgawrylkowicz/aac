import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsAccessibilityPage } from './settings-accessibility';

@NgModule({
  declarations: [
    SettingsAccessibilityPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsAccessibilityPage),
  ],
})
export class SettingsAccessibilityPageModule {}
