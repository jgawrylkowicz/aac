import { types, parser } from 'cfgrammar-tool';
import { Tagger, Lexer } from 'pos';
import { SentenceModel } from './sentence-model';



export interface LanguageInterface{

  check(message:SentenceModel):boolean;

}

export class EnglishModel implements LanguageInterface{

  private Grammar;
  private wordExtracter:Lexer;
  private wordTagger: Tagger;

  constructor(){

    this.wordExtracter = new Lexer();
    this.wordTagger = new Tagger();

    this.Grammar = types.Grammar;
    let Rule = types.Rule;
    let T = types.T;
    let NT = types.NT;

    var exprGrammar = this.Grammar([
      Rule('S', [NT('NP'), NT('VP')]),
      Rule('VP', [NT('VP'), NT('PP')]),
      Rule('VP', [NT('V'), NT('NP')]),
      Rule('VP', [NT('V')]),

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
    ]);

  }


  public check(message:SentenceModel){


    //console.log(message);
    // [0] = word , [1] = tag

    // extract into entities using tagger and lexer
    let text:string = message.toString();
    let words:Array<string> = this.wordExtracter.lex(text);
    let taggedWords:Array<string> = this.wordTagger.tag(words);
    //console.log(taggedWords);

    // translate entities into single characters
    let expression = '';
    let adapter:EntityAdapterInterface = new EnglishAdapter();
    for (let w of taggedWords){
      expression += adapter.getEntity(w[1]);
    }
    console.log('exp', expression);

    // parse using created grammar rules
    // return parser.parse(this.Grammar, 'pvvp').length > 0;
    return false;
  }

}

interface EntityAdapterInterface{
  getEntity(tag):string;

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
  constructor(){

  }


  // Terminals of the Context Free Language
  // A = adjective = c
  // Adv = adverb = b
  // Pn = Personal noun = p
  // V = verb = v
  // Det = determiner = a
  // P = Preposition  = w
  // N = noun = n

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
      default:
        return '';
    }

  }


}
