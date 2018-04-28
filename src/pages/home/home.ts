import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { BoardsProvider } from '../../providers/boards/boards';
//import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { BoardModel } from '../../models/board-model';
import { BoardSetModel } from '../../models/boardset-model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  wordPrediction:boolean;
  isfromDirectory:boolean;

  message: string;
  boardSet:BoardSetModel;
  currentBoard:BoardModel;

  constructor(public navCtrl: NavController,
    public plt: Platform,
    public boardsProvider: BoardsProvider) {

      // both of these file have to be defined otherwise their member functions can't be accessed
      this.boardSet = new BoardSetModel();
      this.currentBoard = new BoardModel();
      this.isfromDirectory = false;

  }

  ionViewDidLoad() {
    this.loadSettings();

  }

  async loadSettings(){
    this.message = '';
    this.wordPrediction = false;
    try {
      this.boardSet = await this.boardsProvider.getBoardSet();
      await console.log("boards", this.boardSet);
      await this.setBoardAsActive(0);
    } catch {
      console.log("Error: A problem occured while loading the boards from the storage. ")
    }
  }

  // sets a board from the array as the current one
  // 0 is the index of the root board
  setBoardAsActive(id:number){
    try {
      if (!this.boardSet.isEmpty()){
        this.currentBoard = this.boardSet.getBoardByIndex(id);
        console.log("currentBoard", this.currentBoard);
      } else console.log("Error: No boards loaded.")
    } catch {
      console.log("Error: No boards loaded.")
    }
  }

  addWord(text: string){

    let word:string = text;

    if(this.message.length == 0) {
      word = text.charAt(0).toUpperCase() + text.slice(1);
      this.message += word;
    } else {
      this.message += " " + word;
    }

    // go back to the root board
    if (this.isfromDirectory) this.setBoardAsActive(0);

  }

  removeLastWord(){

    var lastIndex = this.message.lastIndexOf(" ");
    this.message = this.message.substring(0, lastIndex);

  }

  speak(){

  }

  clearMessage(){
    this.message = '';
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



}
