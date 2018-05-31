import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PreferencesProvider } from '../../providers/preferences/preferences';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  public boardSet:string;
  public language:string;
  public fontSize:number;
  public grammarCheck:number;
  public wordPrediction:boolean;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public prefProvider: PreferencesProvider
  ) {

      this.boardSet = 'default-material';
      this.fontSize = 100;
      this.language = 'en';
      this.grammarCheck = 0;
      this.wordPrediction = false;

      // Load settings

  }

  ionViewDidLoad() {
    this.loadSettings();
  }

  public async loadSettings(){
    try{
      await this.prefProvider.setFontSize(this.fontSize);
      console.log('fontSize',await this.prefProvider.getFontSize())
    } catch {
      console.log("Saving the font size failed");
    }


  }

  public async getFontSize(){

    let value = (await this.fontSize ) / 100;
    return value + "em !important";
  }

}
