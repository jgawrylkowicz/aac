import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { PreferencesProvider } from '../../providers/preferences/preferences';
import { SettingsBoardsPage } from '../settings-boards/settings-boards';
import { SettingsLangPage } from '../settings-lang/settings-lang';
import { SettingsBoardsPageModule } from '../settings-boards/settings-boards.module';
import { SettingsAccessibilityPage } from '../settings-accessibility/settings-accessibility';

//TODO navigation does not work as it should
// when compressed the content should allow the user
// to go back to the list

@IonicPage()
@Component({
  selector: 'page-settings-pane',
  templateUrl: 'settings-pane.html',
})
export class SettingsPanePage {


  root:any;
  pages:any[];
  boardSet;

  @ViewChild("content") contentCtrl: NavController;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public prefProvider: PreferencesProvider) {

    this.root = SettingsBoardsPage;
    this.pages = [{title:"Boards",
                  link: SettingsBoardsPage},
                  {title:"Language & Speech",
                  link: SettingsLangPage},
                  {title:"Accessibility",
                  link: SettingsAccessibilityPage}];

  }

  async ionViewDidLoad() {
    this.boardSet = await this.prefProvider.getCurrentBoardSet();
  }

  public openPage(p) {
    this.contentCtrl.setRoot(p.link);
  }

}
