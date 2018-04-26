import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { BoardsProvider } from '../../providers/boards/boards';
//import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { BoardModel } from '../../models/board-model';
import { isRightSide } from 'ionic-angular/util/util';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  wordPrediction:boolean;
  isfromDirectory:boolean;

  message: string;
  boards:Array<BoardModel>;
  currentBoard:BoardModel;

  constructor(public navCtrl: NavController,
    public plt: Platform,
    public boardsProvider: BoardsProvider) {

      // both of these file have to be defined otherwise their memeber functions can't be accessed
      this.boards = new Array<BoardModel>();
      this.currentBoard = new BoardModel();
      this.isfromDirectory = false;

  }

  ionViewDidLoad() {
    this.loadSettings();

  }

  async loadSettings(){
    this.message = '';
    this.wordPrediction = false;
    this.boards = await this.boardsProvider.getBoards();
    await console.log("boards", this.boards);
    await this.setBoardAsActive(0);
  }

  // sets a board from the array as the current one
  // 0 is the index of the root board
  setBoardAsActive(id:number){
    if (this.boards && this.boards.length > 0){
      this.currentBoard = this.boards[id];
    } else console.log("Error: No boards loaded.")
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
    for (let board of this.boards){
      if (board.id === id){
        this.currentBoard = board;
        this.isfromDirectory = true;
      }
    }
  }



}
