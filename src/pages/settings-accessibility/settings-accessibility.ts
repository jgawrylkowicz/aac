import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PreferencesProvider } from '../../providers/preferences/preferences';
import { Events } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-settings-accessibility',
  templateUrl: 'settings-accessibility.html',
})
export class SettingsAccessibilityPage {

  public fontSize:number;
  public fontWeight:number;
  public buttonSize:number;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public prefProvider: PreferencesProvider,
    public events: Events,
    public toastCtrl: ToastController,
    public platform: Platform
  ) {

    this.fontSize = 100;
    this.fontWeight = 400;
    this.buttonSize = 85;

  }

  async ionViewDidLoad() {
    await this.loadPrefernces();
  }

  async ionViewWillUnload(){
    await this.savePrefernces();
  }

  public async loadPrefernces(){

    try{
      this.fontSize = await this.prefProvider.getFontSize();
      this.fontWeight = await this.prefProvider.getFontWeight();
      this.buttonSize = await this.prefProvider.getButtonSize();
    } catch {
      console.log("Loading the preferences has failed");
    }

  }

  public async savePrefernces(){
  // check for single preferences if they changed
  // and publish events which the home page has subscribed to
    try{

      let isChanged:boolean = false;

      if (this.fontSize !== await this.prefProvider.getFontSize()){
        await this.prefProvider.setFontSize(this.fontSize);
        this.events.publish('fontSize:changed', this.fontSize, Date.now());
        isChanged = true;
      }

      if (this.fontWeight !== await this.prefProvider.getFontWeight()){
        await this.prefProvider.setFontWeight(this.fontWeight);
        this.events.publish('fontWeight:changed', this.fontWeight, Date.now());
        isChanged = true;
      }

      if (this.buttonSize !== await this.prefProvider.getButtonSize()){
        await this.prefProvider.setButtonSize(this.buttonSize);
        this.events.publish('buttonSize:changed', this.buttonSize, Date.now());
        isChanged = true;
      }

      if (isChanged){
        this.presentToast();
      }

    } catch {
      console.log("Saving the preferences has failed");
    }
  }


  private presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Settings were saved successfully',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  public getFontSize():string{
    let value =  (this.fontSize / 100) * 1.75;
    return value + "rem";
  }

}
