export class BoardModel{

  public id: string;
  public localPath: string;
  public grid: Array<any>;

  // add classes for buttons

  constructor(board?:any, path?:string){

    if (board){
      this.localPath = path;
      this.id = board.id;
      this.grid = BoardModel.transform(board, this.localPath);
    } else {
      this.localPath = undefined;
      this.id = undefined;
      this.grid = new Array<any>();
    }

  }

  public getGrid(){
    return this.grid;
  }

  private static transform(board, path):Array<any>{
    let grid = new Array<any>();
    if (board.grid && board.grid.order){

      for (let i = 0; i < board.grid.order.length; i++){
        grid.push(new Array<any>());

        for(let j = 0; j < board.grid.order[i].length; j++){
          let index = board.grid.order[i][j];
          let button = BoardModel.getButtonByID(board,index);
          // some boards may have empty buttons
          if (button !== undefined){
            button.image_url = (button.image_id) ? (path + 'images/' + 'image_' + button.image_id + ".png") : " ";
            grid[i].push(button);
          }
        }
      }
      return grid;
    }
  }

  private static getButtonByID(board, id:number){
    if (board.buttons && board.buttons.length){
      for (let button of board.buttons){
        if (button.id === id) return button;
      }
    } else console.log("Error: This board does not contain any buttons.")
  }

}
