import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { Events } from 'ionic-angular';

import { Platform } from 'ionic-angular';
import { ImageLoader } from 'ionic-image-loader';
import { TextToSpeech } from '@ionic-native/text-to-speech';

import { BoardsProvider } from '../../providers/boards/boards';
import { PreferencesProvider } from '../../providers/preferences/preferences';
import 'rxjs/add/operator/map';
import { BoardModel } from '../../models/board-model';
import { ButtonModel } from '../../models/button-model';
import { BoardSetModel } from '../../models/boardset-model';
import { SentenceModel, EntityModel, PhraseModel, WordModel, CharacterModel } from '../../models/sentence-model';
import { LanguageInterface, EnglishModel } from '../../models/language-model';
import { SettingsPanePage } from '../settings-pane/settings-pane';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  wordPrediction:boolean;
  isfromDirectory:boolean;
  lang:LanguageInterface;

  grammarCheck: boolean;
  autoCorrectLevel:number;
  isCorrect:number;

  message: SentenceModel;
  boardSet:BoardSetModel;
  currentBoard:BoardModel;
  grid:any;

  prediction:any;
  fontSize:number;
  currentBoardName:string;

  constructor(
    public navCtrl: NavController,
    public events: Events,
    private imageLoader: ImageLoader,
    public plt: Platform,
    public boardsProvider: BoardsProvider,
    public prefProvider: PreferencesProvider,
    public tts: TextToSpeech
    ) {

      // both of these file have to be defined otherwise their member functions can't be accessed
      this.currentBoard = new BoardModel();
      this.message = new SentenceModel();
      this.prediction = new Array<any>();
      this.isfromDirectory = false;
      this.grammarCheck = false;
      this.autoCorrectLevel = 0;
      this.wordPrediction = false;
      this.isCorrect = -1; // -1 is untouched, 0 is incorrect, 1 is correct
      this.grid = {
        rows: ['1fr', '1fr', '1fr', '1fr', '1fr'],
        columns: 5
      }
      this.fontSize = 100;

      // preload images
      // imageLoader.preload('http://path.to/image.jpg');
      // imageLoader.clearCache();

      events.subscribe('boardSet:changed', (boardSetName, time) => {
        // user and time are the same arguments passed in `events.publish(user, time)`
        this.loadBoard(boardSetName);
      });

      events.subscribe('fontSize:changed', (fontSize, time) => {
        this.fontSize = fontSize;
      });

      events.subscribe('language:changed', (language, time) => {
        this.lang = language;
      });

      events.subscribe('grammarCheck:changed', (value, time) => {
        this.grammarCheck = value;
      });

      events.subscribe('autoCorrectLevel:changed', (level, time) => {
        this.autoCorrectLevel = level;
      });

      events.subscribe('wordPrediction:changed', (value, time) => {
        this.wordPrediction = value;
        this.redrawCSSGrid(this.boardSet);
      });


  }

  async ionViewDidLoad() {

    await this.loadPreferences();
    await this.loadSettings();
    this.createMockup();

  }


  pushSettings(){
    this.navCtrl.push(SettingsPanePage);
  }


  public async loadBoard(name:string){

    try {
      this.boardSet = await this.boardsProvider.getBoardSet( await this.prefProvider.getCurrentBoardSet() );
      console.log("loadBoard():The board set has been successfully loaded from the BoardsProvider", this.boardSet);
      await this.setBoardAsActive(0);
      await this.redrawCSSGrid(this.boardSet);
      this.currentBoardName = await this.prefProvider.getCurrentBoardSet();
    } catch {
      console.log("loadBoard(): Error: A problem occured while loading the boards from the BoardsProvider")
    }

  }

  async loadPreferences(){

    try {
      // await this.prefProvider.getLanguage();
      // the language is loaded in the settings
      this.fontSize = await this.prefProvider.getFontSize();
      this.grammarCheck = await this.prefProvider.getGrammarCheck();
      this.autoCorrectLevel = await this.prefProvider.getAutoCorrectLevel();
      this.wordPrediction = await this.prefProvider.getWordPrediction();
      this.currentBoardName = await this.prefProvider.getCurrentBoardSet();
    } catch {
      console.log("The Preferences could not be restored");
    }


  }

  public async loadSettings(){

    try {
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
    } catch {
      console.log("loadSettings(): The language settings could not be retrieved from the preferences");
    }

    try {
      let boardSetName:string = await this.prefProvider.getCurrentBoardSet();
      await this.loadBoard(boardSetName);
    } catch {
      console.log("loadSettings(): The name of the board set could not be retrieved from the preferences");
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

    array.push('auto');
    for (var i = 0; i < rows; i++ ){
      array.push('1fr');
    }

    let grid = {
      rows: array,
      columns: boardset.getNumOfColumns()
    };

    this.grid = grid;

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

    if (this.message.length() > 0){
      this.lang.correct(this.message, this.autoCorrectLevel);
    }

    if (this.message.length() > 0 && this.grammarCheck){
      this.isCorrect = (await this.lang.check(this.message)) ? 1 : 0;
    }


  }

  public async addCharacter(char){

    this.message.add(new CharacterModel(char));
  }

  public displayMessage():string{
    if (this.message !== undefined){
      return this.message.toString();
    }
    return " ";
  }

  public async removeLastWord(){
    this.message.removeLast();

    if (this.message.length() === 0 && !this.currentBoard.isKeyboard()) {
      this.isCorrect = -1;
    }

    if (this.message.length() > 0 && this.grammarCheck && !this.currentBoard.isKeyboard()){
      this.isCorrect = (await this.lang.check(this.message)) ? 1 : 0;
    }



  }

  speak(){
    this.tts.speak({text: this.message.toString(), rate: 1.2})
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

  public getFontSize():string{
    let value =  (this.fontSize / 100) * 1.75;
    return value + "rem";
  }



}
