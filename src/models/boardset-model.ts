import { BoardModel } from "./board-model";

export class BoardSetModel{

  private name:string;
  private path:string;
  private boards:Array<BoardModel>;

  constructor(name?: string, path?:string, boards?:Array<BoardModel> ){
    this.name = name;
    this.path = path;
    this.boards = boards;
  }

  public getName():string{
    return this.name;
  }
  public getPath():string{
    return this.path;
  }
  public getBoards():Array<BoardModel>{
    return this.boards;
  }
  public getBoardByIndex(index:number):BoardModel{
    if (index <= this.boards.length){
      return this.boards[index];
    }
  }
  public getBoardByID(id:string):BoardModel{
    for (let board of this.boards){
      if (board.id === id){
        return board;
      }
    }
  }


}
