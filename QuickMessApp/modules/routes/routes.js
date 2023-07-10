const auth = require('../api/auth_utils.js');
const chatUtils = require('../api/chat_utils.js');
const validation = require('../validation/validation.js');
const CryptoJS = require('crypto-js');
const moment = require('moment');
const utilities = require('../utilities.js');
const config = require('../config/config');
let countries;

(async function () {
    countries = await utilities.readFileAsync("public/data/country.json");
})();

// Setup up ChatGPT configuration
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: config.openAIApiKey,
});
const openai = new OpenAIApi(configuration);

let rephraseWithGpt = async function runCompletion (message, operation) {
    let query = `Extend this message: "${message}"`

    if (operation === '-1') {
        query = `Make this message shorter: "${message}"`
    }
    else if (operation === '-2') {
        query = `Translate this message in english: "${message}"`
    }
    console.log(query)
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        max_tokens: 700,
        prompt: query
    });
    return completion.data.choices[0].text;
}

let getUsersAndFriendRequests = async function (user_id){
    let users = await auth.getUsersBasicInfo();
    let friend_requests, friend_requests_sent_by_me, exclude_users, filteredUsers;
    try{
        let friend_requests_items = await auth.getFriendRequestsById(user_id);
        friend_requests = friend_requests_items["friendRequests"].map(id => id.toString());
        friend_requests_sent_by_me = friend_requests_items["friendRequestsSentByMe"].map(id => id.toString());

        let friends = await auth.getFriendsById(user_id);
        friends = friends.map(id => id.toString());

        exclude_users = [...friend_requests];
        exclude_users = exclude_users.concat(friend_requests_sent_by_me);
        exclude_users = exclude_users.concat(friends);

        //exclude current user from them
        filteredUsers = users.filter(e => e.id.toString() !== user_id);

        //add attribute friendshipAlreadyRequested
        filteredUsers = filteredUsers.map(function(user){
            const index = exclude_users.indexOf(user.id.toString());
            user["friendshipAlreadyRequested"] = index > -1;
            return user;
        });
        friend_requests = await auth.getUsersBasicInfoByMultipleIds(friend_requests);
        return {"friend_requests": friend_requests, "filteredUsers":filteredUsers};
    } catch(e){
        console.log(e)
        console.log("User is not logged");
    }
    return null;
}

let getFriendsByUserId = async function (user_id){
    let friends = await auth.getFriendsById(user_id);
    friends = friends.map(id => id.toString());
    friends = await auth.getUsersBasicInfoByMultipleIds(friends);

    let friend_requests_items = await auth.getFriendRequestsById(user_id);
    let friend_requests = friend_requests_items["friendRequests"].map(id => id.toString());
    friend_requests = await auth.getUsersBasicInfoByMultipleIds(friend_requests);
    return {
        "friends": friends,
        "friend_requests": friend_requests
    };
}

module.exports = {

    rephraseMessagePost: async function (req, res) {
        if (typeof req.session.user == "undefined"){
            res.redirect("/login");
            return;
        }
        let user_input = req.body;
        console.log("rephraseMessagePost: ");
        console.log(user_input);
        try {
            if (typeof user_input != "undefined") {
                let error = req.cookies["error"];
                res.clearCookie("error");

                if (typeof user_input.message === "undefined") {
                    res.sendStatus(400);
                    return;
                }
                let word_number = 50;
                if (typeof user_input.word_number != "undefined") {
                    word_number = user_input.word_number;
                }

                let rephrasedMessage = await rephraseWithGpt(user_input.message, word_number);
                let data_to_send = {
                    message: rephrasedMessage,

                    user: req.session.user,
                    enable_index_css: true,
                    error: error,
                    enable_searchbar_css: true,
                    enable_people_css: true
                }
                res.send(data_to_send);
            } else {
                res.sendStatus(400);
            }
        } catch(exception) {
            res.sendStatus(404);
        }
    },

    index: async function (req, res) {
        if (typeof req.session.user == "undefined"){
            res.redirect("/login");
            return;
        }
        let error = req.cookies["error"];
        res.clearCookie("error");
        let friend_requests;
        try {
            if (typeof req.session.user != "undefined") {
                let posts = await auth.getUserPostsById(req.session.user.id);
                posts.sort(function (a, b) {
                    return new Date(b.date) - new Date(a.date);
                });
                if (posts) {
                    req.session.user.posts = posts;
                }
                let friend_requests_items = await auth.getFriendRequestsById(req.session.user.id);
                friend_requests = friend_requests_items["friendRequests"].map(id => id.toString());
                friend_requests = await auth.getUsersBasicInfoByMultipleIds(friend_requests);
            }
        } catch(UnhandledPromiseRejectionWarning){
            console.log("Error ocurred in index page. Probably because user is not logged in.");
        }

        res.render('index', {
            user: req.session.user,
            enable_index_css: true,
            error: error,
            moment: moment,
            enable_people_css: true,
            friendRequests: friend_requests
        });
    },

    indexPost: async function (req, res) {
        if (typeof req.session.user == "undefined"){
            res.sendStatus(403);
            return;
        }
        let newPost = {
            message: req.body["post-textarea"],
            owner: req.body["user_id"],
            date: moment()
        };
        console.log("Postare Primita de la userul " + req.body["user_id"]);
        try {
            await auth.insertPostMessage(newPost);
            res.sendStatus(200);
        } catch (exception) {
            res.sendStatus(400);
        }
    },

    registerGet: function (req, res) {
        if (req.session.user) {   //if logged
            res.redirect("/");
            return;
        }
        let error = req.cookies["error"];
        res.clearCookie("error");
        res.render('register', {countries: countries, error: error});
    },

    registerPost: async function (req, res) {
        let username = req.body.username;
        let password = req.body.password;
        let passwordConfirmation = req.body.passwordConfirmation;
        let email = req.body.email;
        let birthDay = req.body.birthday;
        let firstName = req.body.firstname;
        let lastName = req.body.lastname;
        let gender = req.body.gender;
        let city = req.body.city;
        let country = req.body.country;

        if (!validation.validateEmail(email) || !validation.validateName(firstName) || !validation.validateName(lastName) || !validation.validateUsername(username)) {
            res.cookie("error", {status: true, message: "Invalid data"});
            res.sendStatus(400);
            return;
        }
        if (password !== passwordConfirmation) {
            res.cookie("error", {status: true, message: "Passwords don't match"});
            res.sendStatus(400);
            return;
        }
        let user = await auth.getUser(username);
        if (user != null) {
            res.cookie("error", {status: true, message: "Username already exists"});
            res.sendStatus(400);
            return;
        }
        let imagePath;
        if (gender === "male") {
            imagePath = "images/male.png";
        } else if (gender === "female") {
            imagePath = "images/female.jpg";
        }
        let new_user = {
            username: username,
            password: password,
            email: email,
            birthDay: birthDay,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            role: "user",
            gender: gender,
            city: city,
            country: country,
            status: "offline",
            profileImagePath: imagePath,
        };
        await auth.insertUser(new_user);
        res.sendStatus(200);
    },

    inbox: async function (req, res) {
        if (typeof req.session.user == "undefined"){
            res.redirect("/login");
            return;
        }
        let friends, currentFriend, messages, user;
        try {
            if (typeof req.session.user != "undefined") {
                user = req.session.user;
                friends = await auth.getFriendsById(req.session.user.id);
                friends = await auth.getUsersBasicInfoByMultipleIds(friends);
                if (friends.length > 0){
                    currentFriend = friends[0];
                    messages = await chatUtils.getMessages(currentFriend.id, user.id);
                } else {
                    currentFriend = undefined;
                    messages = [];
                }
            }
        } catch(UnhandledPromiseRejectionWarning){
            console.log("Error ocurred in inbox page. Probably because user is not logged in.");
        }
        res.render('chat', {
            user: req.session.user,
            enable_chat_css: true,
            enable_index_css: true,
            socket_enable: true,
            friends: friends,
            currentFriend: currentFriend,
            messages: messages,
            moment: moment
        });
    },

    loginGet: function (req, res) {
        let error = req.cookies["error"];
        res.clearCookie("error");
        if (req.session.user) {   //if logged
            res.redirect("/");
            return;
        }
        res.render("login", {error: error});
    },

    loginPost: async function (req, res) {
        if (!validation.validateUsername(req.body.username)) {
            res.cookie("error", {status: true, message: "Invalid username"});
            res.sendStatus(400);
            return;
        }
        //console.log("Parola hash primita:" + req.body.password);
        let user = await auth.getUser(req.body.username, req.body.password);
        if (user == null) {
            res.cookie("error", {status: true, message: "Incorrect data"});
            res.sendStatus(400);
            return;
        }
        delete user.password;
        user["age"] = utilities.calculateAge(user.birthDay);
        req.session.user = user;
        res.sendStatus(200);
    },

    discoverGet: async function (req, res) {
        if (typeof req.session.user == "undefined"){
            res.redirect("/login");
            return;
        }
        let error = req.cookies["error"];
        res.clearCookie("error");
        let data = await getUsersAndFriendRequests(req.session.user.id);
        res.render("discover", {
            user: req.session.user,
            enable_index_css: true,
            error: error,
            enable_searchbar_css: true,
            users: data["filteredUsers"],
            enable_people_css: true,
            friendRequests: data["friend_requests"]
        });
    },

    discoverPost: async function (req, res) {
        if (typeof req.session.user == "undefined"){
            res.redirect("/login");
            return;
        }
        if (req.body["user-operation"] === "view"){
            req.session.view_profile = req.body.user_id;
            res.redirect("/view-profile");
        } else if (req.body["user-operation"] === "add"){
            console.log("Friend Request for: " + req.body.user_id + " de la " + req.body.user_request_id);
            await auth.insertFriendRequest(req.body.user_id, req.body.user_request_id)
            res.redirect("/discover");
        }
    },

    logout: function (req, res) {
        if (req.session.user) {   //if logged
            console.log("Sesiune utilizator [Log-OUT]: ", req.session.user.id);
            req.session.user = undefined;
        }
        res.redirect("/login");
    },

    friendshipNotification: async function (req, res) {
        if (typeof req.session.user == "undefined"){
            res.redirect("/login");
            return;
        }
        console.log("Friend Request for: " + req.body.user_id + " de la " + req.body.user_request_id);
        console.log("FriendShip response: " + req.body.accept_friendship );
        try{
            let user_id = req.body["user_id"];
            let user_who_requested_friendship = req.body["user_request_id"];
            await auth.clearFriendRequest(user_id, user_who_requested_friendship);
            if (req.body.accept_friendship === "true"){
                await auth.insertFriendship(user_id, user_who_requested_friendship);
                await chatUtils.insertChat(user_id, user_who_requested_friendship);
            }

        } catch(exception){
            console.log("Error in frienshipNotification. Probably user is not logged in.")
        }
        if (typeof req.body.currentpage != "undefined"){
            res.redirect("/" + req.body.currentpage);
        } else {
            res.redirect("/");
        }
    },

    friendsGet: async function (req, res) {
        if (typeof req.session.user == "undefined" ){
            res.redirect("/login");
            return;
        }
        let error = req.cookies["error"];
        res.clearCookie("error");
        let data;
        try{
            data = await getFriendsByUserId(req.session.user.id);
        } catch(UnhandledPromiseRejectionWarning){
            console.log("User is not logged");
        }

        res.render("friends", {
            user: req.session.user,
            enable_index_css: true,
            error: error,
            enable_searchbar_css: true,
            users: data["friends"],
            enable_people_css: true,
            friendRequests: data["friend_requests"]
        });
    },

    friendshipRemove:  async function (req, res) {
        if (typeof req.session.user == "undefined"){
            res.redirect("/login");
            return;
        }
        console.log("Friend Remove Request for: " + req.body.user_id + " de la " + req.body.user_id_to_remove);
        try{
            let user_id = req.body["user_id"];
            let friend_id = req.body["friend_id"];
            if (req.body["friend-operation"] === "remove"){
                await auth.removeFriendship(user_id, friend_id);
            } else {
                req.session.view_profile = friend_id;
                res.redirect("/view-profile");
                return;
            }
        } catch(exception){
            console.log("Error in frienshipNotification. Probably user is not logged in.")
        }
        res.redirect("/friends");
    },

    viewProfile: async function (req, res) {
        if (typeof req.session.user == "undefined"){
            res.redirect("/login");
            return;
        }
        //console.log('cookies: ', req.cookies);
        let error = req.cookies["error"];
        res.clearCookie("error");
        let user_to_view = req.session.view_profile;
        req.session.view_profile = undefined;
        let friend_requests, user;
        try {
            if (typeof req.session.user != "undefined" && typeof user_to_view != "undefined") {
                let posts = await auth.getUserPostsById(user_to_view);
                posts.sort(function (a, b) {
                    return new Date(b.date) - new Date(a.date);
                });
                user = await auth.getUserById(user_to_view);
                user["age"] = utilities.calculateAge(user.birthDay);
                if (posts) {
                    user.posts = posts;
                }
                let friend_requests_items = await auth.getFriendRequestsById(req.session.user.id);
                friend_requests = friend_requests_items["friendRequests"].map(id => id.toString());
                friend_requests = await auth.getUsersBasicInfoByMultipleIds(friend_requests);
            }
        } catch(UnhandledPromiseRejectionWarning){
            console.log("Error ocurred in index page. Probably because user is not logged in.");
        }

        res.render('view-profile', {
            user: user,
            enable_index_css: true,
            error: error,
            moment: moment,
            disable_user_welcome: true,
            friendRequests: friend_requests,
            enable_people_css: true
        });
    },

    searchPeoplePost: async function (req, res) {
        if (typeof req.session.user == "undefined"){
            res.redirect("/login");
            return;
        }
        let to_search = req.body.value;
        try {
            if (typeof to_search != "undefined") {
                let error = req.cookies["error"];
                res.clearCookie("error");
                let data = await getUsersAndFriendRequests(req.session.user.id);
                if (to_search !== ""){
                    data["filteredUsers"] = utilities.filterByValue(data["filteredUsers"], to_search);
                }
                let data_to_send = {
                    user: req.session.user,
                    enable_index_css: true,
                    error: error,
                    enable_searchbar_css: true,
                    users: data["filteredUsers"],
                    enable_people_css: true,
                    friendRequests: data["friend_requests"]
                }
                res.send(data_to_send);
            }
        } catch(exception){
            res.sendStatus(404);
        }
    },

    searchFriendPost: async function (req, res) {
        if (typeof req.session.user == "undefined"){
            res.redirect("/login");
            return;
        }
        let to_search = req.body.value;
        try {
            if (typeof to_search != "undefined") {
                let error = req.cookies["error"];
                res.clearCookie("error");
                let data = await getFriendsByUserId(req.session.user.id);
                if (to_search !== ""){
                    data["friends"] = utilities.filterByValue(data["friends"], to_search);
                }
                let data_to_send = {
                    user: req.session.user,
                    enable_index_css: true,
                    error: error,
                    enable_searchbar_css: true,
                    users: data["friends"],
                    enable_people_css: true,
                    friendRequests: data["friend_requests"],
                }
                res.send(data_to_send);
            }
        } catch(exception) {
            res.sendStatus(404);
        }
    },

    deletePost: async function (req,res){
        if (typeof req.session.user == "undefined"){
            res.redirect("/login");
            return;
        }
        try{
            console.log("User Id " + req.body.user_id + " requested deletion for:  " + req.body.post_id);
            await auth.removePost(req.body.user_id, req.body.post_id);
        } catch(exception){
            console.log("Exception occured in deletion of the post");
        }
        res.redirect("/");
    }
}
