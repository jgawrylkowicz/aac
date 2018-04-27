export class BoardModel{

  public id: string;
  public grid: Array<any>;

  constructor(board?:any, path?:string, settings?: any){

    if (board){
      this.id = board.id;
      this.grid = BoardModel.transform(board, path, settings);
    } else {
      this.id = undefined;
      this.grid = new Array<any>();
    }

  }

  public getGrid(){
    return this.grid;
  }

  private static transform(board, path, settings):Array<any>{
    let grid = new Array<any>();
    if (board.grid && board.grid.order){

      for (let i = 0; i < board.grid.order.length; i++){
        grid.push(new Array<any>());

        for(let j = 0; j < board.grid.order[i].length; j++){
          let index = board.grid.order[i][j];
          let button = BoardModel.getButtonByID(board,index);
          // some boards may have empty buttons
          if (button !== undefined && settings !== undefined){

            try {
              let image_url = settings.paths.images[button.image_id];
              if (image_url !== undefined)
                button.image_url = (button.image_id) ? (path + image_url) : "";
            } catch {
              console.log("Error: The image with id " + button.image_id + "could not be loaded.")
            }
          }
          grid[i].push(button);
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
