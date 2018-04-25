import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { BoardsProvider } from '../../providers/boards/boards';
//import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  wordPrediction:boolean;
  message: string;
  native:boolean;

  boards:Array<any>;
  currentBoard:Array<any>;
  // grid and boards need a refractor
  // grid is used to draw the 2d communication board and contains all the buttons in the right order
  // boards is an array of communication boards
  // currentboard needs to be implemented

  constructor(public navCtrl: NavController,
    public plt: Platform,
    public boardsProvider: BoardsProvider) {

      this.boards = new Array<any>();
      this.currentBoard = new Array<any>();

  }

  ionViewDidLoad() {
    this.loadSettings();
  }

  loadSettings(){
    this.message = '';
    this.wordPrediction = true;
    this.native = false;
    this.getBoards();
  }

  async getBoards(){
    this.boards = await this.boardsProvider.getBoards();
    //console.log(this.boards);
    this.setBoardAsActive(0);
  }

  // need an interface for settings later
  private getBoardSettings():Promise<Array<string>>{
    return this.boardsProvider.getBoardSettings();
  }

  getBoard(filename:string):Promise<string>{
    return this.boardsProvider.getBoard(filename);
  }

  setBoardAsActive(id:number){
    if (this.boards && this.boards.length > 0){
      this.currentBoard = this.boards[id];
      console.log("currentBoard",this.currentBoard);
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

  }

  removeLastWord(){

    var lastIndex = this.message.lastIndexOf(" ");
    this.message = this.message.substring(0, lastIndex);

  }

  speak(){

  }


     // let url:string = '../../assets/boards/';
    // let dir:string = 'cache';

    // // create a new directory
    // if (this.native) this.file.createDir(url, dir, false);

    // // unzip the obz file
    // if (this.native){
    //   this.plt.ready().then((readySource) => {

    //     this.zip.unzip(url + 'communikate-20.obz', url + dir, (progress) => console.log('Unzipping, ' + Math.round((progress.loaded / progress.total) * 100) + '%'))
    //     .then((result) => {
    //       if(result === 0) console.log('SUCCESS');
    //       if(result === -1) console.log('FAILED');
    //     });

    //   });
    // }

    // this.plt.ready().then((readySource) => {

    //   let data:any = this.file.readAsText('assets/cache/communikate-20', 'manifest.json' )
    //   .then(_ => console.log('File exists'))
    //   .catch(err => console.log("Err:" + err));

    //   console.log('data', data);
    // });

    //let data = this.http.get('assets/cache/communikate-20/manifest.json');
    //console.log(data);



}
