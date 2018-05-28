# AAC app for people with complex communication needs

This project was developed in the course of my bachelor thesis and offers a very simple AAC solution for symbol communication. It is a dynamic platform for the open source communications boards — Open Board Format – which user can easily change depending on their needs. The focus of my thesis was on the NLU. The goal is to implement features that make the communication for the affected people much easier. That's why I have already implemented a basic algorithm based on the phrase structure rules by Chomsky that checks the grammar of the composed message. Additionally, I want the app to correct the message in simple cases automatically. For example, if the user presses on "He" and "go", the verb will be conjugated to "goes". On top of that, I would also like to implement a basic prediction algorithm, which will decrease the number of required actions by the user. 

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


