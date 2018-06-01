export class ButtonModel{

  private id:number;
  private imageURL:string;
  private label:string;
  private borderColor:string;
  private backgroundColor:string


  public constructor(id?:number, imageURL?:string, label?:string, borderColor?:string, backgroundColor?:string){

    this.id = id;
    this.imageURL = imageURL;
    this.label = label;
    this.borderColor = borderColor;
    this.backgroundColor = backgroundColor;
  }

  public getID():number{
    return this.id;
  }

  public getImageURL():string{
    return this.imageURL;
  }

  public getLabel():string{
    return this.label;
  }

  public getBorderColor():string{
    return this.borderColor;
  }

  public getBackgroundColor():string{
    return this.backgroundColor;
  }


}

export class DirectoryModel extends ButtonModel{
  private linkedBoardID: string;

  constructor(id:number, imageURL:string, label:string, borderColor:string, backgroundColor:string, linkedBoardID:string){

    super(id, imageURL, label, borderColor, backgroundColor);
    this.linkedBoardID = (linkedBoardID) ? linkedBoardID : null;

  }

  public isDirectory():boolean{
    return true;
  }

  public getLinkedBoardID():string{
    return this.linkedBoardID;
  }

}

export class PhraseModel extends ButtonModel{

  constructor(id:number, imageURL:string, label:string, borderColor:string, backgroundColor:string, linkedBoardID?:string){

    super(id, imageURL, label, borderColor, backgroundColor);

  }

  public isDirectory():boolean{
    return false;
  }


}

