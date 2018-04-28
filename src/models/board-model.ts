import { ButtonModel } from "./button-model";
import { DirectoryModel } from "./button-model";
import { PhraseModel } from "./button-model";

export class BoardModel{

  public id: string;
  public grid: Array<ButtonModel>;

  constructor(board?:any, path?:string, settings?: any){

    if (board){
      this.id = board.id;
      this.grid = BoardModel.transform(board, path, settings);
    } else {
      this.id = undefined;
      this.grid = new Array<ButtonModel>();
    }

  }

  public getGrid():Array<ButtonModel>{
    return this.grid;
  }

  private static transform(board, path, settings):Array<ButtonModel>{
    let grid = new Array<any>();
    if (board.grid && board.grid.order){

      for (let i = 0; i < board.grid.order.length; i++){
        grid.push(new Array<any>());

        for(let j = 0; j < board.grid.order[i].length; j++){
          let index = board.grid.order[i][j];
          let button:ButtonModel = BoardModel.createButton(board,index,path,settings);
          // some boards may have empty buttons
          if (button !== undefined){
            grid[i].push(button);
          }
        }
      }
      return grid;
    }
  }

  private static createButton(board, id:number, path, settings):ButtonModel{
    if (board.buttons && board.buttons.length){
      for (let button of board.buttons){
        if (button.id === id) {
          try {
            let image_url = settings.paths.images[button.image_id];

            if (button.load_board){
              return new DirectoryModel(button.id, path + image_url, button.label, button.border_color, button.background_color,button.load_board.id );
            } else {
              return new PhraseModel(button.id, path + image_url, button.label, button.border_color, button.background_color);
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
