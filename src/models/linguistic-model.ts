export class SentenceModel {
  public entities:Array<EntityModel>;

  constructor() {
    this.entities = new Array<EntityModel>();
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
        let firstWord = this.entities[i].label.charAt(0).toUpperCase() + this.entities[i].label.slice(1);
        message += firstWord;
      } else {
        message += ' ' + this.entities[i].label;
      }
    }
    return message;
  }

}


//
export abstract class EntityModel{
  public label:string;

  constructor(label:string){
    this.label = label;
  }
}


export abstract class WordModel extends EntityModel {
  constructor(label:string){
    super(label);
  }
}


export abstract class PhraseModel extends EntityModel {

  public words: Array<WordModel>;

  constructor(label:string){
    super(label);
    this.words = new Array<WordModel>();
  }

}

export class SubjectModel extends WordModel{

  constructor(label:string){
    super(label);
  }

}

export class VerbModel extends WordModel {

  constructor(label:string){
    super(label);
  }

}
// The Object name is taken
export class ObjectModel extends WordModel {

  constructor(label:string){
    super(label);
  }
}


