//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { File } from '@ionic-native/file'
import { Zip } from '@ionic-native/zip';
import { BoardModel } from '../../models/board-model';

/*
  Generated class for the BoardsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class BoardsProvider {

  settings:any;
  boards:Array<any>;
  path:string; // path to the unzipped board with all the assets

  native:boolean;

  constructor(public http: Http,
    public file: File,
    private zip: Zip) {

    this.boards = new Array<BoardModel>();
    this.native = false;
  }

  public async getBoards():Promise<Array<BoardModel>>{
    this.boards = await this.loadBoards();
    return new Promise<Array<BoardModel>> (resolve => {
      resolve(this.boards);
    });
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

  private async loadBoards():Promise<Array<BoardModel>>{
    // at the time only for the root board
    let boards:Array<BoardModel> = new Array<BoardModel>();
    this.settings = await this.getBoardSettings();

    let rawBoards = new Array<any>();

    for (let value of Object.keys(this.settings.paths.boards)){
      // get all the boards from by calling all keys
      let boardName = this.settings.paths.boards[value];
      let rawBoard:any = await this.getRawBoard(boardName);
      rawBoards.push(rawBoard);
    }
    console.log("Number of boards loaded: ", rawBoards.length);

    return new Promise<Array<BoardModel>> ((resolve, reject) => {

      for (let board of rawBoards){
        let transformedBoard = new BoardModel(board, this.path);
        boards.push(transformedBoard);
      }

      resolve(boards);
    });
  }





}
