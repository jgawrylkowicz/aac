import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PreferencesProvider } from '../../providers/preferences/preferences';
import { SettingsBoardsPage } from '../settings-boards/settings-boards';
import { SettingsLangPage } from '../settings-lang/settings-lang';
import { SettingsAccessibilityPage } from '../settings-accessibility/settings-accessibility';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

// TODO navigation does not work as it should
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
    public prefProvider: PreferencesProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
  ) {

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

  public presentConfirmRestore() {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Do you want restore the default settings?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Restore',
          cssClass: "danger",
          handler: () => {
            this.prefProvider.restoreDefaults();
            this.presentToast();
          }
        }
      ]
    });
    alert.present();
  }

  private presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Settings were restored successfully',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();

  }

}
