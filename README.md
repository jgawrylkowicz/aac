# AAC app for people with complex communication needs

## Abstract

This thesis presents the development process of an Augmentative and Alternative Communication (AAC) mobile application for people with complex communication needs. It proposes a model for developing of an open-source platform using a hybrid framework Ionic. Furthermore, thisthesis not only explains the process, advantages, disadvantages of building an AAC using web technologies but provides a simple NLP approach to improving the grammatical correctness of the language of the constructed messages. The users can use the app, choose the right communication board to suit their personal needs and adjust the level of word processing and correction. In the initial release, the language of the interface and NLP tools is English, however, adding other languages is possible.

## Features

* Grammar checker: The grammar checker gives the user the feedback whether or not the constructed message has the correct syntax.  The grammar of English has been described using phrase structure rules, which are based on the context-free grammar. For parsing the Earley's Parse has been used.

* GUI: scalable UI using CSS Grid

* Word Processing: two cases of auto corrections supporting subject-verb-object sentence structure are conjugation and adding missing prepositions (e.g. "He go" will be changed to "He goes").

* OpenBoardFormat: For storing and loading boards, the open-source format is used called Open Board Format that allows for switching boards at any time.

* Material design used for a communicatoin board increasing text legibility

* Speech synthesis: using native API 

* Settings Menu: The settings are sorted into three different categories: ”Boards”, ”Language” and  ”Accessibility”. Especially with the tablets in mind, a multi-view layout was used. It allows for displaying the content in a more suitable way for tablets.


## Screenshots

![alt text](https://github.com/jgawrylkowicz/aac/blob/master/img/default-material.png "default-material")
![alt text](https://github.com/jgawrylkowicz/aac/blob/master/img/final_settings.png "settings")
![alt text](https://github.com/jgawrylkowicz/aac/blob/master/img/grammar-correct.png "grammar-correct")
![alt text](https://github.com/jgawrylkowicz/aac/blob/master/img/grammar-incorrect.png "grammar-correct")


## Installation

Assuming that npm and its dependencies are already installed on the system, the following command will download the dependencies

```bash
$ npm install
```

For testing purposes, several options are possible for a developer using the Ionic framework.  First of all, the code can be run in a simple browser.  However, it has to be kept in mind, that the native functionality will not function such as text-to-speech at all. To run the code in a browser, the following command is used:

```bash
$ ionic serve
```

Another option is to run the application on a virtual machine which allows the developer to use the entire native functionality of the device. In this example, the platform of choice is iOS, but others are also supported.  Assuming that the native SDKs is installed on the device and all dependencies are fulfilled, the following command creates the virtuals machine and deploys the code onto it:

```bash
$ ionic cordova run ios --livereload -l -c -s --debug--target="iPad--5th-generation-, 11.2"
```
Last but not least option is to convert it to a native iOS project that can be opened in XCode and deploy it onto a real device using:

```bash
$ ionic cordova build ios --prod
```

## TO-DO

### Performance
* <del>The images do not load on iOS devices</del> (Simplified the URL, however the images still dont show up from the unzipped object 26.05.18)
* <del>The board sets are not loaded from the storage and the storage itself is not freed up</del> (The database was not set up properly, the data went into a void)
* Optimize the overall performance, especially the loading in the beginning 
* Optimize the image loading



### UI / UX
* <del>Flexbox issues in the board and prediction grids. The grids should not shrink and grow at that rate. Their size should be more predicatble. </del> (Changed to grid 23.05.18 )
* <del>The behaviour of the prediction row is still not unexpected. The buttons will grow parallel to the width of the display which pushes the bottom rows out of bounds.  </del> (changed images to position absolute)
* <del> The fixed div is higher than the display itself, some buttons are not showing </del> (The flex element, the textfield, caused the issue. After I included it in the board grid, the board is displayed correcly 26.05.18 )
* <del> Improve the pictures and colors of the current board set </del> (New board set created (imagemagick, material colors), 27.05.18) 

### Other
*  <del> Implement Text-To-Speech  </del> (3 lines 25.05.18)
* Add more rules for English (I'm = I am, questions)


