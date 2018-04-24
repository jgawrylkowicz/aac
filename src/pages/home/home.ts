import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { File } from '@ionic-native/file'
import { Zip } from '@ionic-native/zip';
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
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

  settings:any;
  boards:Array<any>;
  currentBoard:Array<any>;

  path:string; // path to the unzipped board with all the assets

  // grid and boards need a refractor
  // grid is used to draw the 2d communication board and contains all the buttons in the right order
  // boards is an array of communication boards
  // currentboard needs to be implemented

  constructor(public navCtrl: NavController,
    public plt: Platform,
    public file: File,
    private zip:Zip,
    public http:Http) {

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
    this.loadBoard();
  }

  async loadBoard(){

    this.settings = await this.getBoardSettings();
    // at the time only for the root board
    let board = await this.getBoard(this.settings.root);
    let transformedBoard:Array<any> = this.transform(board)
    this.boards.push(transformedBoard); // adds the transformed board to the array
    this.setBoardAsActive(0); // sets the root board as the active one

  }



  // need an interface for settings later
  private getBoardSettings():Promise<Array<string>>{

    let url:string = 'assets/cache/communikate-20/';
    let file:string = 'manifest.json';

    // url is need to get images later on
    this.path = url;

    return new Promise(resolve => {
       this.http.get(url + file)
        .map(res =>
          res.json()).subscribe(data => { resolve(data) }
      );
    });
  }

  getBoard(filename:string):Promise<string>{

    let url:string = 'assets/cache/communikate-20/';
    //check if the file exists

    return new Promise(resolve => {
      this.http.get(url + filename)
       .map(res =>
         res.json()).subscribe(data => { resolve(data) }
     );
   });

  }

  transform(board):Array<any>{
    let grid = new Array<any>();
    if (board.grid && board.grid.order){
      for (let i = 0; i < board.grid.order.length; i++){
        grid.push(new Array<any>());
        for(let j = 0; j < board.grid.order[i].length; j++){
          let index = board.grid.order[i][j];
          let button = this.getButtonByID(board,index);
          button.image_url = this.path + 'images/' + 'image_' + button.image_id + ".png";
          grid[i].push(button);
        }
      }
      return grid;
    }
  }

  setBoardAsActive(id:number){
    if (this.boards && this.boards.length > 0){
      this.currentBoard = this.boards[id];
      console.log("currentBoard",this.currentBoard);
    } else console.log("Error: No boards loaded.")
  }

  getButtonByID(board, id:number){
    if (board.buttons && board.buttons.length){
      for (let button of board.buttons){
        if (button.id === id) return button;
      }
    } else console.log("Error: This board does not contain any buttons.")
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
