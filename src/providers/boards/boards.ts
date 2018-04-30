//import { HttpClient } from '@angular/common/http';
import { Injectable, ReflectiveInjector } from '@angular/core';
import { Http } from '@angular/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Zip } from '@ionic-native/zip';
import { NativeStorage } from '@ionic-native/native-storage';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { BoardModel } from '../../models/board-model';
import { BoardSetModel } from '../../models/boardset-model';


@Injectable()
export class BoardsProvider {

  settings:any;
  boardSet:BoardSetModel;
  path:string; // path to the unzipped board with all the assets
  currentBoardName:string;

  constructor(public http: Http,
    public platform: Platform,
    public transfer: FileTransfer,
    public file: File,
    private zip: Zip,
    private nativeStorage: NativeStorage,
    private storage: Storage
    ) {

    this.boardSet = undefined;
    this.settings = undefined;
  }

  public async getBoardSet():Promise<BoardSetModel>{


    //let boardSet = await this.loadFromStorage();
    let boardSet = undefined;
    if (boardSet != undefined ) this.boardSet = boardSet;

    if (boardSet == undefined){
      this.boardSet = await this.loadBoardSet();
      //console.log(this.boardSet);
      //this.saveToStorage(this.boardSet);
    }

    return new Promise<BoardSetModel> (resolve => {
      resolve(this.boardSet);
    });
  }

  private async saveToStorage(boardSet:BoardSetModel){

    if (this.platform.is("ios")){
      // not implemented
      return undefined;

    } else if (this.platform.is("android")) {

      await this.nativeStorage.setItem('boardSet', JSON.stringify(boardSet))
      .then(
        () => console.log("The boardset has been saved."),
        error => console.error('Error storing the boardset', error)
      );

    } else {

      if (await this.storage.ready()){
        await this.storage.set('board', JSON.stringify(boardSet));
        console.log("The boardset has been saved.");
      }
    }

  }

  private async loadFromStorage(){

    if (this.platform.is("ios")){
      // not implemented
      return undefined;

    } else if (this.platform.is("android")) {

      await this.nativeStorage.getItem('boardSet')
      .then((data) => {
          return JSON.parse(data);
        });

    } else {
      // web browser
      if (await this.storage.ready()){
        await this.storage.get('boardSet').then((data) => {
          if (data !== null){
            console.log("The boardset has been loaded from the storage", data);
            return JSON.parse(data);
          }
        });
      }
    }

  }

  // console.log('cache',this.file.cacheDirectory); file://temporary
  // console.log('dataDir',this.file.dataDirectory); file://persistent
  // unzip the board and return its settings file
  // download the file from assets to the native storage and unpack it there
  public async getBoardSettings(file?:string):Promise<Array<string>>{

    if (file === undefined) file = 'communikate-20.obz';
    let settingsFile:string = 'manifest.json';
    let url:string;
    try {
      url = await this.getBoardSettingsURL(file);
      console.log("url", url);
      if ( url  && settingsFile ) {
        this.path = url; // url is need to get images later on
        return new Promise<Array<string>>(resolve => {

          if (this.platform.is("cordova")){
            this.file.readAsBinaryString(url, settingsFile)
            .then( data => resolve(JSON.parse(data)) )
            .catch(err => console.log("Error while reading the data from the board settings file"));
          } else {
            this.http.get(url + settingsFile)
            .map(res =>
              res.json()).subscribe(data => {
                console.log(data);
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

      if (this.platform.is("cordova"))  {

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
        // the web browser cannot access the native funtionality to unzip object
        resolve('assets/cache/communikate-20/');
      }
   })

  }


  // private async unzipBoard(dir:string, zipFile:string):Promise<string>{

  //   try {
  //     if ( await this.zip.unzip(dir + zipFile, dir) === 0){
  //       await this.file.removeFile(dir, zipFile);
  //       return new Promise<string>(resolve => {
  //         resolve(dir)
  //       });
  //     }
  //   } catch {
  //     console.log("Unzipping failed");
  //     return new Promise<string>(reject => {
  //       reject();
  //     });
  //   }
  // }


  // private async moveBoardToStorage(){

  //   if (this.platform.is("cordova"))  {

  //     this.platform.ready().then(() => {

  //       this.file.createDir(this.file.dataDirectory, fileName, true)
  //       .then( dirEntry => {

  //         // Path for Android and iOS
  //         let sourceFile:string = this.file.applicationDirectory + 'www/assets/boards/' + file;
  //         let destinationDir:string = this.file.dataDirectory + '/' + fileName + '/';

  //         const zipFile:string = fileName + '.zip';
  //         const fileTransfer: FileTransferObject = this.transfer.create();

  //         fileTransfer.download(sourceFile, destinationDir + zipFile)
  //         .then( entry => {

  //           if (await file.checkFile(destinationDir , zipFile)) {
  //             let dir = await this.unzipBoard(destinationDir, zipFile);
  //           }

  //           })
  //           .catch(err => {console.log("File does not exist", err);});
  //         })
  //         .catch( err => {console.log("Download failed", err)} );
  //       });
  //     });
  //   }
  // }



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
              console.log(data);
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

    this.settings = await this.getBoardSettings();
    if (this.settings !== undefined){
      let rawBoards = new Array<any>();
      try {
        // TODO this loop does not work for iOS

        for (let value of Object.keys(this.settings.paths.boards)){
          // get all the boards from by calling all keys
           let boardName = this.settings.paths.boards[value];
           let rawBoard:any = await this.getRawBoard(boardName);
           rawBoards.push(rawBoard);
        }
        console.log("Number of boards loaded: ", rawBoards.length);
      } catch {
        console.log("Error occured while creating the raw boards");
      }

      return new Promise<BoardSetModel> ((resolve, reject) => {
        try{
          let boards = new Array<BoardModel>();
          for (let board of rawBoards){
            let transformedBoard = new BoardModel(board, this.path, this.settings);
            if (transformedBoard !== undefined) boards.push(transformedBoard);
          }
          let boardSet:BoardSetModel = new BoardSetModel('', this.path, boards);
          resolve(boardSet);
        } catch {
          console.log("Error: Unzipping of a boardset was interrupted.")
          reject();
        }
      });
    }

  }





}
