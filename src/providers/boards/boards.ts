import { Injectable, ReflectiveInjector } from '@angular/core';
import { Http } from '@angular/http';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Zip } from '@ionic-native/zip';
import { NativeStorage } from '@ionic-native/native-storage';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { BoardModel } from '../../models/board-model';
import { BoardSetModel } from '../../models/boardset-model';
import { PreferencesProvider } from '../preferences/preferences';
import { ButtonModel, DirectoryModel, PhraseModel } from '../../models/button-model';
import { SerializationHelper } from '../../models/serialization-helper';
// iOS images dont show



@Injectable()
export class BoardsProvider {

  boardSets:Array<BoardSetModel>;
  currentBoardSet:BoardSetModel;
  path:string; // path to the unzipped board with all the assets
  loadingMessage:string;
  currentBoardName:string;
  loading;

  constructor(public http: Http,
    public prfProvider: PreferencesProvider,
    public platform: Platform,
    public transfer: FileTransfer,
    public file: File,
    private zip: Zip,
    private nativeStorage: NativeStorage,
    private storage: Storage,
    public loadingCtrl: LoadingController
    ) {

    this.loadingMessage = "Please wait ...";
    this.loading = this.loadingCtrl.create({
      content: this.loadingMessage
    });
    this.currentBoardSet = undefined;
  }


  public async getBoardSet(name?:string):Promise<BoardSetModel>{

    this.loading.present();
    if (!name) {
      // name of the default board
      name = await this.prfProvider.getDefaultBoardSet();
    }
    let boardSet = undefined;
    try {
      let boardSet = await this.loadBoardSetFromStorage(name);
    } catch {
      console.log("Error while attempting to load all board sets from the storage. Loading was rejected.")
    }

    //let boardSet = undefined;
    if (boardSet !== undefined ) this.currentBoardSet = boardSet;

    if (boardSet === undefined){
      console.log("Fallback initialized, trying to create a new board object from the storage.")
      this.loadingMessage = "Fallback initialized. Trying to recreate from the storage";
      this.currentBoardSet = await this.loadBoardSet();
      //console.log(this.currentBoardSet);
      this.saveBoardSetToStorage(this.currentBoardSet, true);
    }

    return new Promise<BoardSetModel> ((resolve, reject )=> {

      if (this.currentBoardSet){
        console.log("Fallback successful");
        this.loadingMessage = "Fallback succesful";
        this.loading.dismiss()
        resolve(this.currentBoardSet);
      }
      else{
        this.loading.dismiss();
        console.log("Fallback failed");
        this.loadingMessage = "Fallback failed";
        reject();
      }
    });
  }

  // saves a board set to the storage
  private async saveBoardSetToStorage(boardSet:BoardSetModel, override?:boolean){

    if (override === undefined || override === null) override = false;

    let savedBoardSets:Array<BoardSetModel>;

    try {
      savedBoardSets = await this.getAllBoardSetsFromStorage();
      if (savedBoardSets.length > 0){
        let index:number = await this.existsInStorage(savedBoardSets, boardSet.getName());
        // override or not
        if (index >= 0 && override){
          savedBoardSets.slice(index, 0);
          savedBoardSets.push(boardSet);
        }
      }
    } catch {
      console.log("No boards to load");
      savedBoardSets = new Array<BoardSetModel>();
    }

    if (await this.platform.ready()) {
      if (this.platform.is("cordova")){

        try {
          await this.nativeStorage.setItem('boardSets', JSON.stringify(savedBoardSets));
          this.setCurrentBoardSet(boardSet.getName());
          console.log("The boardset has been saved.")
        } catch {
          console.error('Error while attempting to store the boardsets');
        }

      } else {
        if (await this.storage.ready()){
          try {
            savedBoardSets.push(boardSet);
            await this.storage.set('boardSets', JSON.stringify(savedBoardSets));
            this.setCurrentBoardSet(boardSet.getName());
            console.log("The boardset has been saved.");
          } catch {
            console.error('Error while attempting to store the boardsets');
          }
        }
      }
    }
  }

  // return the index
  // returns -1 if the board does not exist
  private async existsInStorage(boardSets, boardSetName:string):Promise<number>{

    return new Promise<number>((resolve, reject) => {
      if (boardSets && boardSetName){
        if (boardSets.length === 0) resolve(-1);
        if (boardSets.length === 1) resolve(0);

        for (let boardSet of boardSets){
          if (boardSet.getName() === boardSetName){
            resolve(boardSets.indexOf(boardSet));
          }
        }
      }
      resolve(-1);
    });
  }

  // loads a board set from the storage
  private async loadBoardSetFromStorage(boardSetName):Promise<BoardSetModel>{

    if (boardSetName === undefined || boardSetName === null) {
      console.log("The check for errors failed, fallback intitialized");
      return null;
    }

    if (this.platform.is("cordova")){
      // for native devices
      if (await this.platform.ready()) {
        try {


          let savedBoardSets:Array<BoardSetModel> = JSON.parse( await this.nativeStorage.getItem('boardSets'));

          return new Promise<BoardSetModel>((resolve, reject) => {
            if (savedBoardSets !== undefined && savedBoardSets.length > 0){
              for (let savedBoardSet of savedBoardSets){
                if (savedBoardSet.getName() == boardSetName) {
                  resolve(SerializationHelper.toInstance(new BoardSetModel(), savedBoardSet));
                }
              }
            }
            this.nativeStorage.clear();
            reject();
           });
        } catch {
         console.log("Error while attempting to load all board sets from the storage. No board set has been saved before.");
       }
      }
    } else {
      // for web browser
      if (await this.storage.ready()){
        try {
          let savedBoardSets:Array<any> = JSON.parse(await this.storage.get('boardSets'));
          // The function getName() does not exist,
          // because the object is not of the BoardSetModel class
          // Cast into classes is needed

          return new Promise<BoardSetModel>((resolve, reject) => {
            if (savedBoardSets !== undefined && savedBoardSets.length > 0){
              for (let savedBoardSet of savedBoardSets){
                if (savedBoardSet.name == boardSetName) {
                  resolve(SerializationHelper.toInstance(new BoardSetModel(), savedBoardSet));
                }
              }
            }
            this.storage.clear();
            reject();
           });

        } catch {
          console.log("Error while attempting to load all board sets from the storage. No board set has been saved before.");
        }
      }
    }
  }


  private async getAllBoardSetsFromStorage():Promise<Array<BoardSetModel>>{

    if (this.platform.is("cordova")){
      // for native devices
      if (await this.platform.ready()) {
        try {
          let savedBoardSets:Array<BoardSetModel> = JSON.parse( await this.nativeStorage.getItem('boardSets'));

          return new Promise<Array<BoardSetModel>>((resolve, reject) => {
            if (savedBoardSets !== undefined){

              let serializedBoardSets = new Array<BoardSetModel>();
              for (let savedBoardSet of savedBoardSets){
                serializedBoardSets.push(SerializationHelper.toInstance(new BoardSetModel(), savedBoardSet));
              }
              resolve(serializedBoardSets);
            }
            else reject()
           });
        } catch {
          this.loadingMessage = "Attempt at loading from storage failed";
          console.log("Error while attempting to load all board sets from the storage")
        }
      }
    } else {
      // for web browser
      if (await this.storage.ready()){
        try {
          let savedBoardSets:Array<any> = JSON.parse(await this.storage.get('boardSets'));
          return new Promise<Array<BoardSetModel>>((resolve, reject) => {
            if (savedBoardSets !== undefined){

              let serializedBoardSets = new Array<BoardSetModel>();
              for (let savedBoardSet of savedBoardSets){
                serializedBoardSets.push(SerializationHelper.toInstance(new BoardSetModel(), savedBoardSet));
              }
              resolve(serializedBoardSets);
            }
            else reject()
          });
        } catch {
          this.loadingMessage = "Attempt at loading from storage failed";
          console.log("Error while attempting to load all board sets from the storage")
        }
      }
    }
  }


  // Saves the name of the current board set for later loading
  // The saved set will be set as default
  private setCurrentBoardSet(name:string):void{
    this.prfProvider.setCurrentBoardSet(name);
  }

  // Returns the name of the current board set
  private async getCurrentBoardSet(){
    let data;
    try {
      data = await this.prfProvider.getCurrentBoardSet()
      return new Promise<string>(resolve => resolve(data));
    } catch {
      this.loadingMessage = "Loading from storage failed";
      console.log("Error while loading the board set from the storage")
      return new Promise<string>(reject => reject());
    }

  }

  // console.log('cache',this.file.cacheDirectory); file://temporary
  // console.log('dataDir',this.file.dataDirectory); file://persistent
  // unzip the board and return its settings file
  // download the file from assets to the native storage and unpack it there
  public async getBoardSettings(file?:string):Promise<any>{

    if (file === undefined) file = 'communikate-20.obz';
    let settingsFile:string = 'manifest.json';
    let url:string;
    try {
      url = await this.getBoardSettingsURL(file);
      console.log("The path to the settings has been succesfully resolved", url);
      if ( url  && settingsFile ) {
        this.path = url; // url is need to get images later on
        return new Promise<any>(resolve => {

          if (this.platform.is("cordova")){
            this.file.readAsBinaryString(url, settingsFile)
            .then( data => resolve(JSON.parse(data)) )
            .catch(err => console.log("Error while reading the data from the board settings file"));
          } else {
            this.http.get(url + settingsFile)
            .map(res =>
              res.json()).subscribe(data => {
                resolve(data);
              }
            );
          }

        });
      } else {
        console.log("The path to boards cannot be resolved");
      }
    } catch {
      console.log("Board settings could not be retrieved");
    }
  }


  private async getBoardSettingsURL(file:string):Promise<string>{

    return new Promise<string>(resolve => {

      let fileName = file.substr(0, file.lastIndexOf('.'));

      if (this.platform.is("android") || this.platform.is("ios"))  {

        this.platform.ready().then(() => {

          this.file.createDir(this.file.dataDirectory, fileName, true)
          .then( dirEntry => {

            // Path for Android and iOS
            let sourceFile:string = this.file.applicationDirectory + 'www/assets/boards/' + file;
            let destinationDir:string = this.file.dataDirectory  + fileName + '/';

            const zipFile:string = fileName + '.zip';
            const fileTransfer: FileTransferObject = this.transfer.create();

            fileTransfer.download(sourceFile, destinationDir + zipFile)
            .then( entry => {

              this.file.checkFile(destinationDir , zipFile)
              .then(entry => {
                // Unzip works only for Android and iOS
                // (progress) => console.log('Unzipping, ' + Math.round((progress.loaded / progress.total) * 100) + '%')
                this.zip.unzip(destinationDir + zipFile, destinationDir, progress => {})
                .then((result) => {
                  if(result === 0) {
                    console.log('Unzipping completed');
                    // remove the zip file
                    this.file.removeFile(destinationDir, zipFile)
                    .then(result => {
                      console.log("Zip file deleted");
                      console.log('destination', destinationDir);
                      resolve(destinationDir);
                    })
                    .catch(err => console.log("Zip file was not deleted", err));
                  }
                  if(result === -1) console.log('Unzipping failed');
                });

              })
              .catch(err => {console.log("File does not exist", err);});
            })
            .catch( err => {console.log("Download failed", err)} );
          });
        });
      } else {

        if (this.platform.is("cordova")) {
          console.log("Running cordova in a browser, the board set cannot be unzipped.");
        }
        // the web browser cannot access the native funtionality to unzip object
        resolve('assets/cache/communikate-20/');
      }


      //Fallback for browser


   })

  }


  public async getRawBoard(filename:string):Promise<Array<any>>{

    //check if the file exists
    return new Promise<Array<any>>((resolve,reject) => {
      if (filename && this.path){
        if (this.platform.is("cordova")){
          this.file.readAsBinaryString(this.path, filename)
          .then( data => resolve(JSON.parse(data)) )
          .catch(err => console.log("Error while reading the data from the board settings file"));
        } else {
          this.http.get(this.path + filename)
          .map(res =>
            res.json()).subscribe(data => {
              //console.log(data);
              resolve(data);
            }
          );
        }
      } else {
        console.log("Error while reading the data from the board settings file. File or path are not defined");
        reject();
      }

    });
  }

  private async loadBoardSet():Promise<BoardSetModel>{

    let boardSettings:any = await this.getBoardSettings();
    if (boardSettings !== undefined){
      let rawBoards = new Array<any>();
      try {
        for (let value of Object.keys(boardSettings.paths.boards)){
          // get all the boards from by calling all keys
           let boardName = boardSettings.paths.boards[value];
           let rawBoard:any = await this.getRawBoard(boardName);
           rawBoards.push(rawBoard);
        }
        console.log("Number of loaded boards", rawBoards.length);
      } catch {
        console.log("Error occured while creating the raw boards");
      }

      return new Promise<BoardSetModel> ((resolve, reject) => {
        try{
          let boards = new Array<BoardModel>();
          for (let board of rawBoards){
            let transformedBoard = new BoardModel(board, this.path, boardSettings);
            if (transformedBoard !== undefined) boards.push(transformedBoard);
          }

          let boardSet:BoardSetModel = new BoardSetModel(this.extractNameFromPath(), this.path, boards);
          resolve(boardSet);
        } catch {
          console.log("Error: Unzipping of a boardset was interrupted.")
          reject();
        }
      });
    }

  }

  private extractNameFromPath(){
    if (! this.path) return null;

    let boardSetName = this.path;

    if (boardSetName.charAt(boardSetName.length - 1) === "/" || boardSetName.charAt(boardSetName.length - 1) === "/" ){
      boardSetName = boardSetName.slice(0, -1);
    }
    return  boardSetName.replace(/^.*[\\\/]/, '');
  }





}
