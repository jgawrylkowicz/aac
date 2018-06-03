//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppPreferences } from '@ionic-native/app-preferences';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Injectable()
export class PreferencesProvider {

  private boardSets:any[];
  private defaultLanguage:string;
  private defaultFontSize:number;
  private defaultFontWeight:number;
  private defaultButtonSize:number;
  private defaultBoardSet:string;
  private defaultGrammarCheck:boolean;
  private defaultAutoCorrectLevel:number;
  private defaultWordPrediction:boolean;

  constructor(
    private appPreferences: AppPreferences,
    private platform:Platform,
    private storage: Storage, ) {

    // default settings
    this.boardSets = ["default-material", "communikate-20", "keyboard", "60-core"]
    this.defaultBoardSet = "default-material";
    this.defaultFontSize = 100;
    this.defaultFontWeight = 400;
    this.defaultButtonSize = 85;
    this.defaultLanguage = "en";
    this.defaultGrammarCheck = false;
    this.defaultAutoCorrectLevel = 0;
    this.defaultWordPrediction = false;

  }

  ionViewDidLoad() {

  }

  public async getCurrentBoardSet():Promise<string>{

    return new Promise<string>((resolve,reject )=> {

      if (this.platform.is("cordova")){
        this.appPreferences.fetch("currentBoardSet")
        .then( data => {
            if (data != null) resolve(data);
            else resolve(this.defaultBoardSet);
        })
        .catch( err => resolve(this.defaultBoardSet))
      } else {
        this.storage.get("currentBoardSet")
        .then( data => {
          if (data != null) resolve(data);
          else resolve(this.defaultBoardSet);
        })
        .catch( err => resolve(this.defaultBoardSet))
      }
    });

  }

  public getBoardsetsNames(){
    return this.boardSets;
  }

  public async getDefaultBoardSet():Promise<string>{
    return new Promise<string>((resolve,reject )=> {
      this.appPreferences.fetch("defaultBoardSet")
      .then( data => resolve(data))
      .catch( err => resolve(this.defaultBoardSet))
    });
  }

  public async getLanguage():Promise<string>{
    return new Promise<string>((resolve,reject )=> {

      if (this.platform.is("cordova")){
        this.appPreferences.fetch("language")
        .then( data => {
          if (data != null) resolve(data);
          else resolve(this.defaultLanguage);
        })
        .catch( err => resolve(this.defaultLanguage))
      } else {
        this.storage.get("language")
        .then( data => {
          if (data != null) resolve(data);
          else resolve(this.defaultLanguage);
        })
        .catch( err => resolve(this.defaultLanguage))
      }
    });

  }

  public async getFontSize():Promise<number>{

    return new Promise<number>((resolve,reject )=> {

      if (this.platform.is("cordova")){
        this.appPreferences.fetch("fontSize")
        .then( data => {
          if (data != null) resolve(Number.parseInt(data));
          else resolve(this.defaultFontSize);
        })
        .catch( err => resolve(this.defaultFontSize))
      } else {
        this.storage.get("fontSize")
        .then( data => {
          if (data != null) resolve(Number.parseInt(data));
          else resolve(this.defaultFontSize);
        })
        .catch( err => resolve(this.defaultFontSize))
      }
    });

  }

  public async getFontWeight():Promise<number>{

    return new Promise<number>((resolve,reject )=> {

      if (this.platform.is("cordova")){
        this.appPreferences.fetch("fontWeight")
        .then( data => {
          if (data != null) resolve(Number.parseInt(data));
          else resolve(this.defaultFontWeight);
        })
        .catch( err => resolve(this.defaultFontWeight))
      } else {
        this.storage.get("fontWeight")
        .then( data => {
          if (data != null) resolve(Number.parseInt(data));
          else resolve(this.defaultFontWeight);
        })
        .catch( err => resolve(this.defaultFontWeight))
      }
    });

  }

  public async getButtonSize():Promise<number>{

    return new Promise<number>((resolve,reject )=> {

      if (this.platform.is("cordova")){
        this.appPreferences.fetch("buttonSize")
        .then( data => {
          if (data != null) resolve(Number.parseInt(data));
          else resolve(this.defaultButtonSize);
        })
        .catch( err => resolve(this.defaultButtonSize))
      } else {
        this.storage.get("buttonSize")
        .then( data => {
          if (data != null) resolve(Number.parseInt(data));
          else resolve(this.defaultButtonSize);
        })
        .catch( err => resolve(this.defaultButtonSize))
      }
    });

  }


  public getGrammarCheck(){

    return new Promise<boolean>((resolve,reject )=> {

      if (this.platform.is("cordova")){
        this.appPreferences.fetch("grammarCheck")
        .then( data => {
          let value:boolean = (data == "true") ? true : false;
          resolve(value);
        })
        .catch( err => resolve(this.defaultGrammarCheck))
      } else {
        this.storage.get("grammarCheck")
        .then( data => {
          let value:boolean = (data == "true") ? true : false;
          resolve(value);
        })
        .catch( err => resolve(this.defaultGrammarCheck))
      }
    });

  }

  public getAutoCorrectLevel(){

    return new Promise<number>((resolve,reject )=> {

      if (this.platform.is("cordova")){
        this.appPreferences.fetch("autoCorrectLevel")
        .then( data => {
          if (data != null) resolve(Number.parseInt(data));
          else resolve(this.defaultAutoCorrectLevel);
        })
        .catch( err => resolve(this.defaultAutoCorrectLevel))
      } else {
        this.storage.get("autoCorrectLevel")
        .then( data => {
          if (data != null) resolve(Number.parseInt(data));
          else resolve(this.defaultAutoCorrectLevel);
        })
        .catch( err => resolve(this.defaultAutoCorrectLevel))
      }
    });


  }

  public getWordPrediction(){

    return new Promise<boolean>((resolve,reject )=> {

      if (this.platform.is("cordova")){
        this.appPreferences.fetch("wordPrediction")
        .then( data => {
          let value:boolean = (data == "true") ? true : false;
          resolve(value);
        })
        .catch( err => resolve(this.defaultWordPrediction))
      } else {
        this.storage.get("wordPrediction")
        .then( data => {
          let value:boolean = (data == "true") ? true : false;
          resolve(value);
        })
        .catch( err => resolve(this.defaultWordPrediction))
      }
    });

  }

  public async setCurrentBoardSet(name:string){

    if (this.platform.is("cordova")){
      this.appPreferences.store("currentBoardSet", name);
    } else {
      if (await this.storage.ready()){
        this.storage.set("currentBoardSet", name);
      }
    }
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

  public async setGrammarCheck(value:boolean){

    if (this.platform.is("cordova")){
      this.appPreferences.store("grammarCheck", value.toString());
    } else {
      if (await this.storage.ready()){
        this.storage.set("grammarCheck", value.toString());
      }
    }

  }

  public async setAutoCorrectLevel(level:number){

    if (this.platform.is("cordova")){
      this.appPreferences.store("autoCorrectLevel", level.toString());
    } else {
      if (await this.storage.ready()){
        this.storage.set("autoCorrectLevel", level.toString());
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

  public async setFontWeight(percent:number){

    if (this.platform.is("cordova")){
      this.appPreferences.store("fontWeight", percent.toString());
    } else {
      if (await this.storage.ready()){
        this.storage.set("fontWeight", percent.toString());
      }
    }
  }

  public async setButtonSize(percent:number){

    if (this.platform.is("cordova")){
      this.appPreferences.store("buttonSize", percent.toString());
    } else {
      if (await this.storage.ready()){
        this.storage.set("buttonSize", percent.toString());
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
