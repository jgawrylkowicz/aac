# AAC app for people with complex communication needs

This project was developed in the course of my bachelor thesis and offers a very simple AAC solution for symbol communication. It is a dynamic platform for the open source communications boards — Open Board Format – which user can easily change depending on their needs. The focus of my thesis was on the NLU. The goal is to implement features that make the communication for the affected people much easier. That's why I have already implemented a basic algorithm based on the phrase structure rules by Chomsky that checks the grammar of the composed message. Additionally, I want the app to correct the message in simple cases automatically. For example, if the user presses on "He" and "go", the verb will be conjugated to "goes". On top of that, I would also like to implement a basic prediction algorithm, which will decrease the number of required actions by the user. 

## TO-DO

### Performance
* The images do not load on iOS devices
* The board sets are not loaded from the storage and the storage itself is not freed up
* Optimize the overall performance, especially the loading in the beginning 

### UI / UX
* <del>Flexbox issues in the board and prediction grids. The grids should not shrink and grow at that rate. Their size should be more predicatble. </del> (Changed to grid 23.05.18 )
* The behaviour of the prediction row is still not unexpected. The buttons will grow parallel to the width of the display which pushes the bottom rows out of bounds.  

### Other
* Implement Text-To-Speech


