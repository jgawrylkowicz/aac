import { ButtonModel } from "./button-model";
import { DirectoryModel } from "./button-model";
import { PhraseModel } from "./button-model";
import { Platform } from 'ionic-angular';

export class BoardModel{

  public id: string;
  public grid: Array<Array<ButtonModel>>;
  static platform: Platform;

  constructor(board?:any, path?:string, settings?: any){

    if (board){
      this.id = board.id;
      this.grid = this.transform(board, path, settings);
    } else {
      this.id = undefined;
      this.grid = new Array<Array<ButtonModel>>();
    }

  }

  public getGrid():Array<Array<ButtonModel>>{
    return this.grid;
  }

  public setGrid(grid:Array<Array<ButtonModel>>){
    this.grid = grid;
  }

  public setID(id:string){
    this.id = id;
  }

  public getNumOfRows():number{
   return this.grid.length;
  }

  public getNumOfColumns():number{
    let max:number = 0;
    for(let row of this.grid){
      if (row.length > max) max = row.length;
    }
    return max;
  }

  public isKeyboard(){
    return false;
  }

  private transform(board, path, settings):Array<Array<ButtonModel>>{
    let grid = new Array<Array<ButtonModel>>();
    if (board.grid && board.grid.order){

      for (let i = 0; i < board.grid.order.length; i++){
        grid.push(new Array<ButtonModel>());

        for(let j = 0; j < board.grid.order[i].length; j++){
          let index = board.grid.order[i][j];
          if (index !== null){
            let button:ButtonModel = this.createButton(board,index,path,settings);
            if (button !== undefined){
              grid[i].push(button);
            }
          } else {
            // some boards may have empty buttons
            // front-end will take care of the rest
            // no need for another class just for blank buttons
            // console.log("Empty button");
            grid[i].push(null);
          }
        }
      }
      return grid;
    }
  }

  private createButton(board, id:number, path, settings):ButtonModel{

    if (board.buttons && board.buttons.length){
      for (let button of board.buttons){
        if (button.id === id) {
          try {

            // Url for images from the assets folder
            // "../assets/cache/communikate-20/images/...
            let image_url:string = settings.paths.images[button.image_id];
            let image_path:string = path + image_url;

            if (button.load_board){
              return new DirectoryModel(button.id, image_path, button.label, button.border_color, button.background_color,button.load_board.id );
            } else {
              return new PhraseModel(button.id, image_path, button.label, button.border_color, button.background_color);
            }
          } catch {
            console.log("Error: The image with id " + button.image_id + "could not be loaded.")
          }
        }
      }
    } else console.log("Error: This board does not contain any buttons.")
  }

  public isEmpty():boolean{
    if (this.grid != undefined){
      return (this.grid.length == 0);
    } else return false;
  }

}


export class KeyboardModel extends BoardModel{

  constructor(board?:any, path?:string, settings?: any){
    super(board, path, settings);
  }

  public isKeyboard(){
    return true;
  }

}
