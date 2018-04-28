//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { File } from '@ionic-native/file'
import { Zip } from '@ionic-native/zip';
import { NativeStorage } from '@ionic-native/native-storage';
import { Storage } from '@ionic/storage';
import { BoardModel } from '../../models/board-model';
import { BoardSetModel } from '../../models/boardset-model';


@Injectable()
export class BoardsProvider {

  settings:any;
  boardSet:BoardSetModel;
  path:string; // path to the unzipped board with all the assets
  native:boolean;
  currentBoardName:string;

  constructor(public http: Http,
    public file: File,
    private zip: Zip,
    private nativeStorage: NativeStorage,
    private storage: Storage
    ) {

    this.boardSet = undefined;
    this.native = false;
  }

  public async getBoardSet():Promise<BoardSetModel>{


    let boardSet = await this.loadFromStorage();
    if (boardSet != undefined ) this.boardSet = boardSet;

    if (boardSet == undefined){
      this.boardSet = await this.loadBoardSet();
      //console.log(this.boardSet);
      this.saveToStorage(this.boardSet);
    }

    return new Promise<BoardSetModel> (resolve => {
      resolve(this.boardSet);
    });
  }

  private saveToStorage(boardSet:BoardSetModel){

    if (this.native){
      this.nativeStorage.setItem('boardSet', boardSet )
      .then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      );
    } else {
      this.storage.set('board', boardSet);
      console.log("Saved.");
    }
  }

  private loadFromStorage(){

   let boardSet = undefined;
   if (this.native){
    this.nativeStorage.getItem('boardSet')
    .then((data) => {
        return JSON.parse(data);
      });
   } else {
    this.storage.get('boardSet').then((data) => {
      if (data !== null){
       return JSON.parse(data);
      }
    });
   }
    return boardSet;
  }

  public getBoardSettings():Promise<Array<string>>{

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

  public getRawBoard(filename:string):Promise<any>{

    let url:string = 'assets/cache/communikate-20/';
    //check if the file exists
    return new Promise<any>(resolve => {
      this.http.get(url + filename)
      .map(res => res.json()).subscribe(data => {
        resolve(data) }
      );
    });
  }

  private async loadBoardSet():Promise<BoardSetModel>{

    this.settings = await this.getBoardSettings();
    let rawBoards = new Array<any>();

    for (let value of Object.keys(this.settings.paths.boards)){
      // get all the boards from by calling all keys
      let boardName = this.settings.paths.boards[value];
      let rawBoard:any = await this.getRawBoard(boardName);
      rawBoards.push(rawBoard);
    }
    console.log("Number of boards loaded: ", rawBoards.length);

    return new Promise<BoardSetModel> ((resolve, reject) => {
      try{
        let boards = new Array<BoardModel>();
        for (let board of rawBoards){
          let transformedBoard = new BoardModel(board, this.path, this.settings);
          if (transformedBoard !== undefined) boards.push(transformedBoard);
        }
        let boardSet:BoardSetModel = new BoardSetModel('', this.path, boards);
        resolve(boardSet);
      } catch {
        console.log("Error: Unzipping of a boardset was interrupted.")
      }
    });
  }





}
