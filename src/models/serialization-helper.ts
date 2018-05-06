import { ButtonModel } from "./button-model";
import { BoardSetModel } from "./boardset-model";
import { BoardModel } from "./board-model";
import { DirectoryModel } from "./button-model";
import { PhraseModel } from "./button-model";

// casts JSON objects into TS classes
// some objects (liek buttons) posses funtions on which the UI depends
export class SerializationHelper{

  static toInstance<T>(obj: T, json:any):any{

    if (obj instanceof BoardSetModel){

      let name:string = json.name;
      var path:string = json.path;
      let boards = Array<BoardModel>();

      for (let board of json.boards){
        boards.push( SerializationHelper.toInstance(new BoardModel(), board))
      }
      return new BoardSetModel(name, path, boards);

    } else if (obj instanceof BoardModel){

      let id:string = json.id;
      let grid = new Array();
      for(var i = 0; i < json.grid.length; i++){
        grid[i] = new Array<ButtonModel>();
        for(var j = 0; j < json.grid[i].length; j++){
          if (json.grid[i][j] === null) {
            grid[i].push(null);
          } else {
            grid[i][j] = SerializationHelper.toInstance(new ButtonModel(), json.grid[i][j]);
          }
        }
      }
      let board = new BoardModel();
      board.setGrid(grid);
      board.setID(id);

      return board;

    } else if (obj instanceof ButtonModel) {

      let id:number = json.id;
      let imageURL:string = json.imageURL;
      let label:string = json.label;
      let borderColor:string = json.borderColor;
      let backgroundColor:string = json.backgroundColor;
      let linkedBoardID:string = (json.linkedBoardID) ? json.linkedBoardID : undefined;

      if (linkedBoardID !== undefined) {
        return new DirectoryModel(id,imageURL,label,borderColor,backgroundColor, linkedBoardID);
      } else return new PhraseModel(id,imageURL,label,borderColor,backgroundColor);
    }
  }
}
