# QuickMess

This project represents a social network application written in node.js.
Database used is mongoDB. 

#### Notes
* Passwords are stored encrypted in the database (encryption realised on client side)
* Created users will have a default image according to his genre. Change user avatar functionality is not yet implemented.

#### Functionalities implemented
* Login/ register
* Writing/ deleting posts
* Inbox/ message functionality using sockets
* Search friends/ people
* Request/delete friendships
* View profile
* Chat assistance

#### Details
Frontend server runs on port 2014: ```http://localhost:2014/```.

Backend server runs on port 5123: ```http://localhost:5123/```.


Passwords coincide with usernames and [images names].

#### Some users:
- tiosca
- pikachu
- bucefal
- bunny
- ricardo
- pedro

## Steps to run this project
### Backend (ASP.Net with MongoDB)

1. Install [mongoDb](https://docs.mongodb.com/manual/administration/install-community/)
2. Install [mongoDb Compass](https://www.mongodb.com/products/compass) in order to visualize and load data. After installed:
    * Create a database called quickMess
    * Create a collection called users and load data from [users.json]
    * Create a collection called chats and load data from [chats.json]

### Frontend (Node.JS)
1. Make sure you have [node.js](https://nodejs.org/en/) installed
2. Change directory to QuickMessApp
3. Run the following commands:
    * ```npm install``` in order to install the dependencies this project relies on.
    * ```bower install``` in order to install the dependencies to the client  (moment and crypto-js).
    * ```node app.js``` in order to start the project

## Docker Deployment todo