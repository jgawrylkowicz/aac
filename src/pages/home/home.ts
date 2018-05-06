import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { BoardsProvider } from '../../providers/boards/boards';
//import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { BoardModel } from '../../models/board-model';
import { BoardSetModel } from '../../models/boardset-model';
import { SentenceModel, EntityModel, WordModel, SubjectModel } from '../../models/linguistic-model';

// TODO the database needs to be cleared from time to time
// reaches more than 10MB

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  wordPrediction:boolean;
  isfromDirectory:boolean;

  message: SentenceModel;
  //message:string;
  boardSet:BoardSetModel;
  currentBoard:BoardModel;

  constructor(
    public navCtrl: NavController,
    public plt: Platform,
    public boardsProvider: BoardsProvider) {

      // both of these file have to be defined otherwise their member functions can't be accessed
      //this.boardSet = new BoardSetModel();
      this.currentBoard = new BoardModel();
      this.message = new SentenceModel();
      this.isfromDirectory = false;

  }

  ionViewDidLoad() {
    this.loadSettings();
  }

  async loadSettings(){
    //this.message = '';
    this.wordPrediction = false;
    try {
      this.boardSet = await this.boardsProvider.getBoardSet();
      await console.log("The board set has been successfully loaded from the BoardsProvider", this.boardSet);
      await this.setBoardAsActive(0);
    } catch {
      console.log("Error: A problem occured while loading the boards from the BoardsProvider")
    }
  }

  // sets a board from the array as the current one
  // 0 is the index of the root board
  setBoardAsActive(id:number){
    try {
      if (!this.boardSet.isEmpty()){
        this.currentBoard = this.boardSet.getBoardByIndex(id);
        //console.log("currentBoard", this.currentBoard);
      } else console.log("Error: No boards loaded.")
    } catch {
      console.log("Error: No boards loaded.")
    }
  }

  private isWord(text:string):boolean{
    if (text !== undefined){
      for (let char of text){
        if (char == ' ') return false;
      }
    }
    return false;
  }


  public addWord(text: string):void{

    let label:string = text;
    let entity = new SubjectModel(label);

    // if (this.isWord(label)){
    //   // Word
    //   //alert("word");
    // } else {
    //   // Phrase
    //   //alert("phrase");
    // }

    this.message.add(entity);
    // go back to the root board
    if (this.isfromDirectory) this.setBoardAsActive(0);

  }

  public displayMessage():string{
    if (this.message !== undefined){
      return this.message.toString();
    }
    return " ";
  }


  removeLastWord(){
    this.message.removeLast();
  }

  speak(){

  }

  clearMessage(){
    this.message.clear();
  }

  changeBoard(id:string){

    if (this.boardSet){
      this.currentBoard = this.boardSet.getBoardByID(id);
      console.log("changed to", this.currentBoard);
      if (this.currentBoard !== undefined){
        this.isfromDirectory = true;
      }
    }else {
      console.log("Error: The board set is empty.")
    }
  }



}
