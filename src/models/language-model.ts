import { types, parser } from 'cfgrammar-tool';
import { Tagger, Lexer } from 'pos';
import { SentenceModel, EntityModel, WordModel } from './sentence-model';
import { Inflectors, Inflector } from "en-inflectors";



export interface LanguageInterface{

  check(message:SentenceModel):Promise<boolean>;
  correct(message:SentenceModel):Promise<string>;

}



export class EnglishModel implements LanguageInterface{

  private exprGrammar;
  private wordExtracter:Lexer;
  private wordTagger: Tagger;
  private adapter: EntityAdapterInterface;


  constructor(){

    this.wordExtracter = new Lexer();
    this.wordTagger = new Tagger();
    this.adapter = new EnglishAdapter();


    var Grammar = types.Grammar;
    let Rule = types.Rule;
    let T = types.T;
    let NT = types.NT;

    // Basic phrase strcuture rules for english
    // These following rules are based on the Chomsky's rule:  S -> NP | VP
    // Sentence -> Noun Phase | Verb Phase

    // TODO need to find a way to tag the abrevations ( "I'm" is not tagged to "I am" )

    this.exprGrammar = Grammar([
      Rule('S', [NT('NP'), NT('VP')]),

      Rule('VP', [NT('VP'), NT('PP')]),
      Rule('VP', [NT('V'), NT('NP')]),
      Rule('VP', [NT('V')]),
      Rule('VP', [NT('VP'), NT('NP')]),
      //---------------------------------
      // These 3 need to checked
      Rule('VP', [NT('V'), T('t')]),
      Rule('VP', [NT('V'), T('t'), NT('VP') ]),
      Rule('VP', [NT('MD'), NT('V')]),
      //---------------------------------
      Rule('PP', [NT('P'), NT('NP')]),

      Rule('NP', [NT('Det'), NT('N')]),
      Rule('NP', [NT('N')]),
      Rule('NP', [NT('Pn')]),
      Rule('NP', [NT('Det'), NT('A'), NT('N')]),
      Rule('NP', [NT('A'), NT('NP')]),

      Rule('A', [NT('Adv'), NT('A')]),
      Rule('A', [NT('A'), NT('A')]),
      Rule('A', [NT('A'), NT('A')]),
      Rule('A', [T('c')]),

      Rule('Adv', [T('b')]),
      Rule('Pn', [T('p')]),
      Rule('V', [T('v')]),
      Rule('Det', [T('a')]),
      Rule('P', [T('w')]),
      Rule('N', [T('n')]),
      Rule('MD', [T('m')]),
    ]);

  }


  public check(message:SentenceModel):Promise<boolean>{

    return new Promise<boolean>(resolve => {

      // [0] = word , [1] = tag
      // extract into entities using tagger and lexer
      let text:string = message.toString();
      let words:Array<string> = this.wordExtracter.lex(text);
      let taggedWords:Array<string> = this.wordTagger.tag(words);

      // translate entities into single characters
      let expression = '';

      for (let w of taggedWords){
        expression += this.adapter.getEntity(w[1]);
      }
      // console.log('exp', expression);
      // parse using created grammar rules
      resolve(parser.parse(this.exprGrammar, expression).length > 0);
    });
  }

  public correct(message: SentenceModel):Promise<string>{

    return new Promise<string>(resolve => {

      let entities = message.getEntities();
      if (entities.length > 0) {


        for (var i = 1; i < entities.length; i++ ){

          let firstWord = entities[i-1].getLabel();
          let secondWord = (entities.length > 0) ? entities[i].getLabel() : null;

          // Basic verb conjugation 0
          // The loop goes through the message and looks for 2 successive words,
          // a subject and a verb in that order
          // Then it calls the adapter method to find the right conjugation
          if ( this.adapter.isSubject(firstWord) && (this.adapter.isVerb(secondWord) || this.adapter.isModalVerb(secondWord)) ) {

            let conjugatedVerb = this.adapter.conjugate(firstWord, secondWord);
            entities[i].setLabel(conjugatedVerb);

          }

          // isVerb() does not return true for a modal verb
          if ( this.adapter.isVerb(firstWord) && this.adapter.isVerb(secondWord) ) {
            entities.splice(i,0, new WordModel("to"));
          }

          // More autocorrection method goes here

          // TODO insert the right articles in front of a noun
          // Tests:
            // boy want go -> a boy wants to go
            // boy listens girl -> a boy listens to a girl
            // young boy listen  girl -> a young boy listens to a girl


          // if (this.adapter.isNoun(firstWord)){

          //   let inf = new Inflector(firstWord);
          //   if (! this.adapter.isDeterminer(firstWord)){
          //     if (inf.isCountable()){
          //       if (inf.isPlural()){
          //         const word = new WordModel('the');
          //         if ((i-1) === 0) {
          //           entities.unshift(word);
          //         } else {
          //           entities.splice(i,0, word);
          //         }
          //       } else {
          //         const word = new WordModel('a');
          //         if ((i-1) === 0) {
          //           entities.unshift(word);
          //         } else {
          //           entities.splice(i,0, word);
          //         }
          //       }
          //     }
          //   }
          // }

        }
      }

    });

  }

}

interface EntityAdapterInterface{
  getEntity(tag):string;
  isVerb(word):boolean;
  isModalVerb(word):boolean;
  isDeterminer(word):boolean;
  isSubject(word):boolean;
  isNoun(word):boolean;
  isAdjective(word):boolean;
  conjugate(noun, verb);


}

class EnglishAdapter implements EntityAdapterInterface{


  // Pos.js
  // CC Coord Conjuncn           and,but,or
  // CD Cardinal number          one,two
  // DT Determiner               the,some
  // EX Existential there        there
  // FW Foreign Word             mon dieu
  // IN Preposition              of,in,by
  // JJ Adjective                big
  // JJR Adj., comparative       bigger
  // JJS Adj., superlative       biggest
  // LS List item marker         1,One
  // MD Modal                    can,should
  // NN Noun, sing. or mass      dog
  // NNP Proper noun, sing.      Edinburgh
  // NNPS Proper noun, plural    Smiths
  // NNS Noun, plural            dogs
  // POS Possessive ending       Õs
  // PDT Predeterminer           all, both
  // PP$ Possessive pronoun      my,oneÕs
  // PRP Personal pronoun         I,you,she
  // RB Adverb                   quickly
  // RBR Adverb, comparative     faster
  // RBS Adverb, superlative     fastest
  // RP Particle                 up,off
  // SYM Symbol                  +,%,&
  // TO ÒtoÓ                     to
  // UH Interjection             oh, oops
  // VB verb, base form          eat
  // VBD verb, past tense        ate
  // VBG verb, gerund            eating
  // VBN verb, past part         eaten
  // VBP Verb, present           eat
  // VBZ Verb, present           eats
  // WDT Wh-determiner           which,that
  // WP Wh pronoun               who,what
  // WP$ Possessive-Wh           whose
  // WRB Wh-adverb               how,where
  // , Comma                     ,
  // . Sent-final punct          . ! ?
  // : Mid-sent punct.           : ; Ñ
  // $ Dollar sign               $
  // # Pound sign                #
  // " quote                     "
  // ( Left paren                (
  // ) Right paren               )

  private wordExtracter:Lexer;
  private wordTagger: Tagger;

  constructor(){
    this.wordExtracter = new Lexer();
    this.wordTagger = new Tagger();
  }


  // Terminals of the Context Free Language
  // A = adjective = c
  // Adv = adverb = b
  // Pn = Personal noun = p
  // V = verb = v
  // Det = determiner = a
  // P = Preposition  = w
  // N = noun = n
  //  = modal verb = m
  // to

  public getEntity(tag):string{

    switch(tag){
      case 'PRP':
        return 'p'
      case 'NN':
      case 'NNP':
      case 'NNPS':
      case 'NNS':
        return 'n'
      case 'MD':
        return 'm';
      case 'VB':
      case 'VBG':
      case 'VBD':
      case 'VBN':
      case 'VBP':
      case "VBZ":
        return 'v';
      case 'RB':
      case 'RBR':
      case "RBS":
        return 'b';
      case 'JJ':
      case 'JJR':
      case "JJS":
        return 'c';
      case 'DT':
        return 'a';
      case 'IN':
        return 'w';
      case 'TO':
        return 't';
      default:
        return '';
    }
  }

  public conjugate(noun:string, verb:string):string{

    let word = noun.toLowerCase().trim();
    if (word === 'you' || word === 'we' || word === 'they' || word === 'i' || new Inflector(word).isPlural()) {
      return new Inflectors(verb).toPresent();
    } else {
      return new Inflectors(verb).toPresentS();
    }

  }

  public isVerb(word: string):boolean{

    if (word == null) return false;
    let taggedWord = this.wordTagger.tag([word]);

    switch(taggedWord[0][1]){
      case 'MD':
      case 'VB':
      case 'VBG':
      case 'VBD':
      case 'VBN':
      case 'VBP':
      case "VBZ":
        return true;
      default:
        return false;
    }

  }

  public isModalVerb(word: string):boolean{

    if (word == null) return false;
    let taggedWord = this.wordTagger.tag([word]);
    return (taggedWord[0][1] === 'MD');

  }

  public isSubject(word: string):boolean{

    if (word == null) return false;
    let taggedWord = this.wordTagger.tag([word]);

    switch(taggedWord[0][1]){
      case 'PRP':
      case 'NN':
      case 'NNP':
      case 'NNPS':
      case 'NNS':
        return true;
      default:
        return false;
    }

  }

  public isNoun(word: string):boolean{

    if (word == null) return false;
    let taggedWord = this.wordTagger.tag([word]);

    switch(taggedWord[0][1]){
      case 'NN':
      case 'NNP':
      case 'NNPS':
      case 'NNS':
        return true;
      default:
        return false;
    }

  }

  isDeterminer(word):boolean {
    if (word == null) return false;
    let taggedWord = this.wordTagger.tag([word]);
    return taggedWord[0][1] === 'DT';

  }

  isAdjective(word):boolean {
    if (word == null) return false;
    let taggedWord = this.wordTagger.tag([word]);
    return taggedWord[0][1] === 'A';

  }


}
