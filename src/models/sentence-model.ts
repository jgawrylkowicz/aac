export class SentenceModel {
  public entities:Array<EntityModel>;

  constructor() {
    this.entities = new Array<EntityModel>();
  }

  public getEntities(){
    return this.entities;
  }

  public length():number{
    if (this.entities === undefined || this.entities === null ) return 0;
    return this.entities.length;
  }

  public add(entity:EntityModel){
    this.entities.push(entity);
  }

  public removeLast():void{
    if (this.entities.length > 0){
      this.entities.splice(-1, 1);
    }
  }

  public clear():void{
    this.entities = new Array<EntityModel>();
  }

  public toString():string{

    let message:string = '';
    if (this.entities.length === 0) return message;
    for (var i = 0; i < this.entities.length; i++){
      if (i === 0) {
        let firstWord = this.entities[i].getLabel().charAt(0).toUpperCase() + this.entities[i].getLabel().slice(1);
        message += firstWord;
      } else {

        if (this.entities[i] instanceof CharacterModel) {
          message += this.entities[i].getLabel();
        } else {
          message += ' ' + this.entities[i].getLabel();
        }

      }
    }
    return message;
  }

}


//
export abstract class EntityModel{
  private label:string;

  constructor(label:string){
    this.label = label;
  }

  public setLabel(label:string):void{
    this.label = label;
  }

  public getLabel():string{
    return this.label;
  }
}


export class WordModel extends EntityModel{
  constructor(label:string){
    super(label);
  }
}

export class CharacterModel extends EntityModel{
  constructor(label:string){
    super(label);
  }
}


export class PhraseModel extends EntityModel{
  constructor(label:string){
    super(label);
  }
}
