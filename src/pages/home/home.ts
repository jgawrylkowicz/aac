import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { ImageLoader } from 'ionic-image-loader';
import { TextToSpeech } from '@ionic-native/text-to-speech';

import { BoardsProvider } from '../../providers/boards/boards';
//import { Injectable } from '@angular/core';
import { PreferencesProvider } from '../../providers/preferences/preferences';
import 'rxjs/add/operator/map';
import { BoardModel } from '../../models/board-model';
import { ButtonModel } from '../../models/button-model';
import { BoardSetModel } from '../../models/boardset-model';
import { SentenceModel, EntityModel, PhraseModel, WordModel } from '../../models/sentence-model';
import { LanguageInterface, EnglishModel } from '../../models/language-model';

// TODO the database needs to be cleared from time to time
// reaches more than 10MB
// Variable message in the loading popup

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  wordPrediction:boolean;
  isfromDirectory:boolean;
  lang:LanguageInterface;

  grammarCheck: boolean;
  isCorrect:number;

  message: SentenceModel;
  boardSet:BoardSetModel;
  currentBoard:BoardModel;
  grid:any;

  prediction:any;

  constructor(
    public navCtrl: NavController,
    private imageLoader: ImageLoader,
    public plt: Platform,
    public boardsProvider: BoardsProvider,
    public prefProvider: PreferencesProvider,
    public tts: TextToSpeech
    ) {

      // both of these file have to be defined otherwise their member functions can't be accessed
      // this.boardSet = new BoardSetModel();
      this.currentBoard = new BoardModel();
      this.message = new SentenceModel();
      this.prediction = new Array<any>();
      this.isfromDirectory = false;
      this.grammarCheck = false;
      this.wordPrediction = false;
      this.isCorrect = -1; //-1 is untouched, 0 is incorrect, 1 is correct
      this.grid = {
        rows: ['1fr', '1fr', '1fr', '1fr', '1fr'],
        columns: 5
      }


      //preload images
      // imageLoader.preload('http://path.to/image.jpg');


      // imageLoader.clearCache();
      //



  }

  ionViewDidLoad() {
    this.loadSettings();
    this.createMockup();

  }





  async loadSettings(){
    //this.message = '';
    let lang:string = await this.prefProvider.getLanguage();
    switch(lang){
      case 'en':
        this.lang = new EnglishModel();
        break;
      case 'de':
        // not implemented
      default:
        this.lang = new EnglishModel();
    }

    this.grammarCheck = await this.prefProvider.getGrammarCheck();
    //this.wordPrediction = await this.prefProvider.getWordPrediction();


    try {
      this.boardSet = await this.boardsProvider.getBoardSet();

      console.log("loadSettings():The board set has been successfully loaded from the BoardsProvider", this.boardSet);
      await this.setBoardAsActive(0);
      await this.redrawCSSGrid(this.boardSet);
    } catch {
      console.log("loadSettings(): Error: A problem occured while loading the boards from the BoardsProvider")
    }
  }


  // sets a board from the array as the current one
  // 0 is the index of the root board
  setBoardAsActive(id:number){
    try {
      if (!this.boardSet.isEmpty()){
        this.currentBoard = this.boardSet.getBoardByIndex(id);

      } else console.log("Error: No boards loaded.")
    } catch {
      console.log("Error: No boards loaded.")
    }
  }

  private redrawCSSGrid(boardset:BoardSetModel){

    let array = new Array<any>();
    let rows:number = (!this.wordPrediction) ? boardset.getNumOfRows() : boardset.getNumOfRows() + 1;

    for (var i = 0; i < rows; i++ ){
      array.push('1fr');
    }

    let grid = {
      rows: array,
      columns: boardset.getNumOfColumns()
    };

    this.grid = grid;
    console.log('Grid has been redrawn.', grid);
  }

  private isWord(text:string):boolean{
    if (text !== undefined){
      for (let char of text){
        if (char == ' ') return false;
      }
    }
    return true;
  }


  public async addWord(text: string){

    let label:string = text;
    let entity:EntityModel;


    if (! this.isWord(label)) {
      entity = new PhraseModel(label);
    } else entity = new WordModel(label);

    this.message.add(entity);
    // go back to the root board
    if (this.isfromDirectory) this.setBoardAsActive(0);

    if (this.message.length() > 0 && this.grammarCheck){
      this.isCorrect = (await this.lang.check(this.message)) ? 1 : 0;
      console.log(this.isCorrect);
    }

    if (this.message.length() > 0){
      this.lang.correct(this.message);
    }
  }

  public displayMessage():string{
    if (this.message !== undefined){
      return this.message.toString();
    }
    return " ";
  }

  public async removeLastWord(){
    this.message.removeLast();

    if (this.message.length() > 0 && this.grammarCheck){
      this.isCorrect = (await this.lang.check(this.message)) ? 1 : 0;
      console.log(this.isCorrect);
    }

  }

  speak(){
    this.tts.speak(this.message.toString())
    .then(() => console.log('Success'))
    .catch((reason: any) => console.log(reason));
  }

  clearMessage(){
    this.message.clear();
    this.isCorrect = -1;
  }

  changeBoard(id:string){

    if (this.boardSet){
      this.currentBoard = this.boardSet.getBoardByID(id);
      if (this.currentBoard !== undefined){
        this.isfromDirectory = true;
      }
    }else {
      console.log("Error: The board set is empty.")
    }
  }

  createMockup(){

    for (var i=0; i < 5; i++){
      if (i < 3) this.prediction.push( new ButtonModel());
      else this.prediction.push(null);
    }
  }



}
