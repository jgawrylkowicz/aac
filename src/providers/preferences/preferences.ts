import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppPreferences } from '@ionic-native/app-preferences';

@Injectable()
export class PreferencesProvider {

  private lang:string;
  private fontSize:number;
  private currentBoardSet:string;
  private defaultBoardSet:string;
  private grammarCheck:boolean;
  private wordPrediction:boolean;

  constructor( private appPreferences: AppPreferences ) {

    // default settings
    this.defaultBoardSet = "communikate-20";
    this.fontSize = 1.5;
    this.currentBoardSet = undefined;
    this.lang = "en";
    this.grammarCheck = true;
    this.wordPrediction = false;

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

  public getDefaultBoardSet():Promise<any>{
    return new Promise<any>(resolve => resolve(this.defaultBoardSet));
  }

  public getLanguage():Promise<string>{
    return new Promise<string>(resolve => resolve(this.lang));
  }

  public getGrammarCheck():Promise<boolean>{
    return new Promise<boolean>(resolve => resolve(this.grammarCheck));
  }

  public getWordPrediction():Promise<boolean>{
    return new Promise<boolean>(resolve => resolve(this.wordPrediction));
  }




}
