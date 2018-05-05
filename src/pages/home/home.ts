import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { BoardsProvider } from '../../providers/boards/boards';
//import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { BoardModel } from '../../models/board-model';
import { BoardSetModel } from '../../models/boardset-model';


class Sentence {
  public entities:Entity[];

  constructor() {
    this.entities = new Array<Entity>();
  }

  public length(){
    return this.entities.length;
  }

  public add(entity:Entity){
    this.entities.push(entity);
  }

  public removeLast(){
    if (this.entities.length > 0){
      this.entities.splice(-1, 1);
    }
  }

  clear(){
    this.entities = new Array<Entity>();
  }

  public toString():string{
    let message:string = '';
    for (var i = 0; i < this.entities.length; i++){
      if (i === 0) {
        let firstWord = this.entities[i].label.charAt(0).toUpperCase() + this.entities[i].label.slice(1);
        message += firstWord;
      } else {
        message += ' ' + this.entities[i].label;
      }

    }
    return message;
  }

}


//
class Entity{
  public label:string;

  constructor(label:string){
    this.label = label;
  }
}





@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  wordPrediction:boolean;
  isfromDirectory:boolean;

  message: Sentence;
  boardSet:BoardSetModel;
  currentBoard:BoardModel;

  constructor(public navCtrl: NavController,
    public plt: Platform,
    public boardsProvider: BoardsProvider) {

      // both of these file have to be defined otherwise their member functions can't be accessed
      //this.boardSet = new BoardSetModel();
      this.currentBoard = new BoardModel();
      this.message = new Sentence();

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

  addWord(text: string){

    let label:string = text;
    let entity = new Entity(label);
    this.message.add(entity);
    // go back to the root board
    if (this.isfromDirectory) this.setBoardAsActive(0);

  }

  public displayMessage():string{
    //entity.label = text.charAt(0).toUpperCase() + text.slice(1);
    return this.message.toString();

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
