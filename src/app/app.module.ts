import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Zip } from '@ionic-native/zip';
import { NativeStorage } from '@ionic-native/native-storage';
import { IonicStorageModule } from '@ionic/storage';
import { AppPreferences } from '@ionic-native/app-preferences';
import { TextToSpeech } from '@ionic-native/text-to-speech';

import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SettingsPanePage } from '../pages/settings-pane/settings-pane';
import { SettingsBoardsPage } from '../pages/settings-boards/settings-boards';
import { SettingsLangPage } from '../pages/settings-lang/settings-lang';
import { BoardsProvider } from '../providers/boards/boards';
import { PreferencesProvider } from '../providers/preferences/preferences';

import { GridLayoutModule } from '@lacolaco/ngx-grid-layout';
import { IonicImageLoader } from 'ionic-image-loader';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SettingsBoardsPage,
    SettingsPanePage,
    SettingsLangPage,
  ],
  imports: [
    BrowserModule,
    GridLayoutModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__mydb',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    IonicImageLoader.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SettingsBoardsPage,
    SettingsPanePage,
    SettingsLangPage,
  ],
  providers: [
    StatusBar,
    FileTransfer,
    FileTransferObject,
    File,
    Zip,
    TextToSpeech,
    AppPreferences,
    NativeStorage,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BoardsProvider,
    PreferencesProvider
  ]
})
export class AppModule {}
