//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { File } from '@ionic-native/file'
import { Zip } from '@ionic-native/zip';

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

  constructor(public http: Http,
    public file: File,
    private zip: Zip) {
    //console.log('Hello BoardsProvider Provider');
    this.boards = new Array<any>();
  }


  public async getBoards(){

    this.boards = await this.loadBoard();
    console.log("this.board", this.boards);

    return new Promise<Array<any>> (resolve => {
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

  public getBoard(filename:string):Promise<string>{

    let url:string = 'assets/cache/communikate-20/';
    //check if the file exists

    return new Promise(resolve => {
      this.http.get(url + filename)
       .map(res =>
         res.json()).subscribe(data => { resolve(data) }
     );
    });
  }

  private async loadBoard():Promise<Array<any>>{

    // at the time only for the root board
    let boards = new Array<any>();
    this.settings = await this.getBoardSettings();
    let board = await this.getBoard(this.settings.root);

    return new Promise<Array<any>> (resolve => {
      let transformedBoard:Array<any> = this.transform(board);
      boards.push(transformedBoard);
      resolve(boards); // adds the transformed board to the array
    });
  }

  private transform(board):Array<any>{
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

  private getButtonByID(board, id:number){
    if (board.buttons && board.buttons.length){
      for (let button of board.buttons){
        if (button.id === id) return button;
      }
    } else console.log("Error: This board does not contain any buttons.")
  }



}
