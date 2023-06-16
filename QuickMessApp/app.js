const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const routes = require('./modules/routes/routes.js');
const inbox_init = require('./modules/inbox/inbox.js')

const config = require('./modules/config/config');

const app = express();
const port = process.env.PORT? process.env.PORT: 2014

//set the express.static middleware
app.use(express.static(__dirname + "/public"));

app.set('view engine', 'ejs');                      // directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.use(expressLayouts);                            // suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului este views/layout.ejs
app.use(express.static('public'))                   // directorul 'public' va conține toate resursele accesibile direct de către client (e.g., fișiere css, javascript, imagini)
app.use(bodyParser.json());                         // corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în format json în req.body
app.use(bodyParser.urlencoded({extended: true}));   // utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(cookieParser());
app.use(session({
    key: 'user_sid',
    secret: 'secret',
    saveUninitialized: false,
    resave: false
}));

app.get('/', routes.index);
app.get('/register', routes.registerGet);
app.get('/chat', routes.inbox);
app.get('/login', routes.loginGet);
app.get('/logout', routes.logout);
app.get('/discover', routes.discoverGet);
app.get('/friends', routes.friendsGet);
app.get('/view-profile', routes.viewProfile);


app.post('/', routes.indexPost);
app.post('/login', routes.loginPost);
app.post('/register', routes.registerPost);
app.post('/discover', routes.discoverPost);
app.post('/friendship-notification', routes.friendshipNotification);
app.post('/remove-friend', routes.friendshipRemove);
app.post('/search_people', routes.searchPeoplePost);
app.post('/post-delete', routes.deletePost);
app.post('/search-friend', routes.searchFriendPost);
app.post('/rephrase-message', routes.rephraseMessagePost);


//----------------------------------SOCKET PART----------------------------------

//require the http module
const http = require("http").Server(app);
inbox_init["inbox_socket_init"](http)

http.listen(port, () => {
    const frontend_url = (process.env.NODE_ENV === 'Development')? `http://172.19.0.12:${port}`: `http://localhost:${port}`;
    const backend_url = (process.env.NODE_ENV === 'Development')? `http://172.19.0.11:5123`: `http://localhost:5123`;

    console.log(`Serverul de frontend rulează la adresa ${frontend_url}`);
    console.log(`Serverul de backend rulează la adresa ${backend_url}`);
    console.log(`Login ${frontend_url}/login`);
    console.log(`Register ${frontend_url}/register`);
    console.log(`Discover ${frontend_url}/discover`);
    console.log(`Chat ${frontend_url}/chat`);
});
