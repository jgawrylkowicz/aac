import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PreferencesProvider } from '../../providers/preferences/preferences';
import { Events } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})

export class SettingsPage {

  public boardSets:any[];
  public boardSet:string;
  public language:string;
  public fontSize:number;
  public grammarCheck:boolean;
  public autoCorrectLevel:number;
  public wordPrediction:boolean;



  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public prefProvider: PreferencesProvider,
    public events: Events,
    public toastCtrl: ToastController

  ) {

      // this.boardSet = 'default-material';
      // this.fontSize = 100;
      // this.language = 'en';
      // this.grammarCheck = false;
      // this.autoCorrectLevel = 0;
      // this.wordPrediction = false;
  }

  async ionViewDidLoad() {
    await this.loadPrefernces();
  }

  public async loadPrefernces(){
    try{
      this.boardSets = this.prefProvider.getBoardsetsNames();
      this.boardSet = await this.prefProvider.getCurrentBoardSet();
      this.fontSize = await this.prefProvider.getFontSize();
      this.language = await this.prefProvider.getLanguage();
      this.grammarCheck = await this.prefProvider.getGrammarCheck();
      this.autoCorrectLevel = await this.prefProvider.getAutoCorrectLevel();
      this.wordPrediction = await this.prefProvider.getWordPrediction();

    } catch {
      console.log("Loading the preferences has failed");
    }


  }

  async ionViewWillLeave(){
    await this.savePrefernces();
  }

  public async savePrefernces(){
      // check for single preferences if they changed
    // and publish events which the home page has subscribed to
    try{

      let isChanged:boolean = false;
      if (this.boardSet !== await this.prefProvider.getCurrentBoardSet()) {
        await this.prefProvider.setCurrentBoardSet(this.boardSet);
        this.events.publish('boardSet:changed', this.boardSet, Date.now());
        isChanged = true;
      }

      if (this.fontSize !== await this.prefProvider.getFontSize()){
        await this.prefProvider.setFontSize(this.fontSize);
        this.events.publish('fontSize:changed', this.fontSize, Date.now());
        isChanged = true;
      }

      if (this.language !== await this.prefProvider.getLanguage()){
        await this.prefProvider.setLanguage(this.language);
        this.events.publish('language:changed', this.language, Date.now());
        isChanged = true;
      }

      if (this.grammarCheck !== await this.prefProvider.getGrammarCheck()){
        await this.prefProvider.setGrammarCheck(this.grammarCheck);
        this.events.publish('grammarCheck:changed', this.grammarCheck, Date.now());
        isChanged = true;
      }

      if (this.autoCorrectLevel !== await this.prefProvider.getAutoCorrectLevel()){
        await this.prefProvider.setAutoCorrectLevel(this.autoCorrectLevel);
        this.events.publish('autoCorrectLevel:changed', this.autoCorrectLevel, Date.now());
        isChanged = true;
      }

      if (this.wordPrediction !== await this.prefProvider.getWordPrediction()){
        await this.prefProvider.setWordPrediction(this.wordPrediction);
        this.events.publish('wordPrediction:changed', this.wordPrediction, Date.now());
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



}
