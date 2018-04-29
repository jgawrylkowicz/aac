//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { File } from '@ionic-native/file'
import { Zip } from '@ionic-native/zip';
import { NativeStorage } from '@ionic-native/native-storage';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { BoardModel } from '../../models/board-model';
import { BoardSetModel } from '../../models/boardset-model';


@Injectable()
export class BoardsProvider {

  settings:any;
  boardSet:BoardSetModel;
  path:string; // path to the unzipped board with all the assets
  currentBoardName:string;

  constructor(public http: Http,
    public platform: Platform,
    public file: File,
    private zip: Zip,
    private nativeStorage: NativeStorage,
    private storage: Storage
    ) {

    this.boardSet = undefined;
  }

  public async getBoardSet():Promise<BoardSetModel>{


    //let boardSet = await this.loadFromStorage();
    let boardSet = undefined;
    if (boardSet != undefined ) this.boardSet = boardSet;

    if (boardSet == undefined){
      this.boardSet = await this.loadBoardSet();
      //console.log(this.boardSet);
      //this.saveToStorage(this.boardSet);
    }

    return new Promise<BoardSetModel> (resolve => {
      resolve(this.boardSet);
    });
  }

  private async saveToStorage(boardSet:BoardSetModel){

    if (this.platform.is("ios")){
      // not implemented
      return undefined;

    } else if (this.platform.is("android")) {

      await this.nativeStorage.setItem('boardSet', JSON.stringify(boardSet))
      .then(
        () => console.log("The boardset has been saved."),
        error => console.error('Error storing the boardset', error)
      );

    } else {

      if (await this.storage.ready()){
        await this.storage.set('board', JSON.stringify(boardSet));
        console.log("The boardset has been saved.");
      }
    }

  }

  private async loadFromStorage(){

    if (this.platform.is("ios")){
      // not implemented
      return undefined;

    } else if (this.platform.is("android")) {

      await this.nativeStorage.getItem('boardSet')
      .then((data) => {
          return JSON.parse(data);
        });

    } else {
      // web browser
      if (await this.storage.ready()){
        await this.storage.get('boardSet').then((data) => {
          if (data !== null){
            console.log("The boardset has been loaded from the storage", data);
            return JSON.parse(data);
          }
        });
      }
    }

  }

  public async getBoardSettings(fileURL?:string):Promise<Array<string>>{

    //console.log('cache',this.file.cacheDirectory); file://temporary
    //console.log('dataDir',this.file.dataDirectory); file://persistent
    // unzip the board and return its path

    // TODO try unzip with json request instead of the native file

    let url:string;
    let file:string;
    let dirName:string = "com2";

    if (this.platform.is("ios")){

      // not implemented
      url = 'assets/cache/communikate-20/';
      file = 'manifest.json';
    } else if (this.platform.is("android")) {

      // await this.file.createDir(this.file.dataDirectory, dirName, true).then( dirEntry => {
      // console.log("dirEntry", dirEntry);
      // // this.zip.unzip('assets/boards/communikate-20.ozb', 'assets/cache/' + dirName, (progress) => console.log('Unzipping, ' + Math.round((progress.loaded / progress.total) * 100) + '%'))
      // // .then((result) => {
      // //   if(result === 0) console.log('SUCCESS');
      // //   if(result === -1) console.log('FAILED');
      // // });
      // });

      url = 'assets/cache/communikate-20/';
      file = 'manifest.json';

    } else {

      // the web browser cannot access the native funtionality to unzip objects
      url = 'assets/cache/communikate-20/';
      file = 'manifest.json';

    }

    if ( url  && file ) {
      this.path = url; // url is need to get images later on
      return new Promise<Array<string>>(resolve => {
       this.http.get(url + file)
        .map(res =>
          res.json()).subscribe(data => { resolve(data) }
        );
      });
    }

  }

  public async getRawBoard(filename:string):Promise<any>{

    let url:string = this.path;
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
        reject();
      }
    });
  }





}
