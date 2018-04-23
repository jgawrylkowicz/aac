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
  boards:Array<string>;
  grid:Array<number>;
  // instead of getting a button in the frontend,
  // the buttons have to be assigned here

  constructor(public navCtrl: NavController,
    public plt: Platform,
    public file: File,
    private zip:Zip,
    public http:Http) {

      this.boards = new Array<string>();
      this.grid = new Array();

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
    //console.log("settings",this.settings);

    let board = await this.getBoard(this.settings.root);
    console.log("board",board);
    this.boards.push(board);
    this.grid = this.getBoardGridOrder(this.boards[0]);
    console.log("grid",this.grid);




  }

  // need an interface for settings later
  private getBoardSettings():Promise<Array<string>>{

    let url:string = 'assets/cache/communikate-20/';
    let file:string = 'manifest.json';

    return new Promise(resolve => {
       this.http.get(url + file)
        .map(res =>
          res.json()).subscribe(data => { resolve(data) }
      );
    });
  }

  getBoard(file:string):Promise<string>{

    let url:string = 'assets/cache/communikate-20/';
    //check if the file exists

    return new Promise(resolve => {
      this.http.get(url + file)
       .map(res =>
         res.json()).subscribe(data => { resolve(data) }
     );
   });

  }

  getBoardGridOrder(board){
    if (board.grid && board.grid.order){
      return board.grid.order;
    }

  }

  getButtonByID(board, id:number){
    if (board.buttons && board.buttons.length){
      for (let button of board.buttons){
        if (button.id === id) return button;
      }
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
