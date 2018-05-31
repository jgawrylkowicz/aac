//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppPreferences } from '@ionic-native/app-preferences';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Injectable()
export class PreferencesProvider {

  // private language:string;
  // private fontSize:number;
  // private currentBoardSet:string;
  // private defaultBoardSet:string;
  private grammarCheck:number;
  private wordPrediction:boolean;

  constructor(
    private appPreferences: AppPreferences,
    private platform:Platform,
    private storage: Storage, ) {

    // default settings
    // this.defaultBoardSet = "default-material";
    // this.fontSize = 100;
    // this.currentBoardSet = undefined;
    // this.language = "en";
    this.grammarCheck = 0;
    this.wordPrediction = false;

  }

  ionViewDidLoad() {
    this.loadSettings();
  }

  private loadSettings(){

  }


  public setCurrentBoardSet(name:string):void{
    if (name){
      this.appPreferences.store("currentBoardSet", name);
    }
  }

  public async getCurrentBoardSet():Promise<any>{
    return new Promise<any>((resolve,reject )=> {
      this.appPreferences.fetch("currentBoardSet")
      .then( data => resolve(data))
      .catch( err => reject())
    });

  }

  public async getDefaultBoardSet():Promise<string>{
    return new Promise<string>((resolve,reject )=> {
      this.appPreferences.fetch("defaultBoardSet")
      .then( data => resolve(data))
      .catch( err => reject())
    });
  }

  public async getLanguage():Promise<string>{
    return new Promise<string>((resolve,reject )=> {

      if (this.platform.is("cordova")){
        this.appPreferences.fetch("defaultBoardSet")
        .then( data => resolve(data))
        .catch( err => reject())
      } else {
        this.storage.get("defaulBoardSet")
          .then( data => resolve(data))
          .catch( err => reject())
      }
    });

  }

  public async getFontSize():Promise<any>{
    return new Promise<any>((resolve,reject )=> {

      if (this.platform.is("cordova")){
        this.appPreferences.fetch("fontSize")
        .then( data => resolve(data))
        .catch( err => reject())
      } else {
        this.storage.get("fontSize")
          .then( data => resolve(data))
          .catch( err => reject())
      }
    });

  }


  public getGrammarCheck(){
    return this.grammarCheck;
  }

  public getWordPrediction(){
    return this.wordPrediction;
  }

  public async setDefaultBoardSet(name:string){

    if (this.platform.is("cordova")){
      this.appPreferences.store("defaultBoardSet", name);
    } else {
      if (await this.storage.ready()){
        this.storage.set("defaultBoardSet", name);
      }
    }

  }

  public async setLanguage(lang:string){

    if (this.platform.is("cordova")){
      this.appPreferences.store("language", lang);
    } else {
      if (await this.storage.ready()){
        this.storage.set("language", lang);
      }
    }

  }

  public async setGrammarCheck(level:number){

    if (this.platform.is("cordova")){
      this.appPreferences.store("grammarCheck", level.toString());
    } else {
      if (await this.storage.ready()){
        this.storage.set("grammarCheck", level);
      }
    }

  }

  public async setFontSize(percent:number){

    if (this.platform.is("cordova")){
      this.appPreferences.store("fontSize", percent.toString());
    } else {
      if (await this.storage.ready()){
        this.storage.set("fontSize", percent.toString());
      }
    }
  }

  public async setWordPrediction(value:boolean){

    if (this.platform.is("cordova")){
      this.appPreferences.store("wordPrediction", value.toString());
    } else {
      if (await this.storage.ready()){
        this.storage.set("wordPrediction", value.toString());
      }
    }
  }






}
