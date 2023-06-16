const chatUtils = require('../api/chat_utils.js');
const auth = require('../api/auth_utils.js');
const moment = require('moment');

module.exports = {
    "inbox_socket_init": (async function (httpServer) {
        // require the socket.io module
        const io = require("socket.io");

        //integrating socketio
        let serverSocket = io(httpServer);
        let allUsers = {};
        serverSocket.on("connection", socket => {
            console.log("Got connected socket Id : " + socket.id);

            const clientIp = socket.request.connection.remoteAddress;

            console.log("Got connected socket Id : " + socket.id);
            socket.on("establish connection", function (user_info) {
                console.log("The socket connection doesn't reach here");
                console.log("User Id: " + user_info["user_id"] + " wants to chat with " + user_info["friend_id"]);
                allUsers[user_info["user_id"]] = {"socket": socket, "friend_id": user_info["friend_id"]};
                auth.updateUserStatus(user_info["user_id"], "online").then(() => console.log("Update status online succesfully"));
                //broadcast message to everyone in port:5000 except yourself.
            });

            socket.on("chat message", function (data) {
                console.log("\nMessage: " + data["data"]);
                console.log("Sender: " + data["user_id"]);
                console.log("To: " + data["friend_id"]);

                let message_to_insert = {
                    data: data["data"],
                    sender: data["user_id"],
                    receiver: data["friend_id"],
                    date: moment().utcOffset(0)
                };
                chatUtils.insertMessage(data["user_id"], data["friend_id"], message_to_insert).then(function () {
                    console.log("Message Insertion was successful")
                });

                //broadcast message to everyone in port:5000 except yourself.
                for (let key in allUsers) {
                    if (allUsers.hasOwnProperty(key)) {
                        if (key === data["friend_id"]) {
                            console.log("User socket connected. Send data to him.");
                            serverSocket.to(allUsers[key]["socket"].id).emit("received", data);
                            break;
                        }
                    }
                }
                console.log();
                //save chat to the api
            });

            socket.on("change friend", async function (data) {
                console.log("\nUser: " + data["user_id"] + " changed his friend stream to: " + data["friend_id"]);
                //broadcast message to everyone in port:5000 except yourself.
                for (let key in allUsers) {
                    if (allUsers.hasOwnProperty(key)) {
                        if (key === data["user_id"]) {
                            allUsers[key]["friend_id"] = data["friend_id"];

                            let messages = await chatUtils.getMessages(key, allUsers[key]["friend_id"])
                            console.log("Extracted messages from the api. Trying to send an approvement");
                            serverSocket.to(socket.id).emit("change friend approved", messages);
                            break;
                        }
                    }
                }

                //save chat to the api
            });
            socket.on('disconnect', function () {
                for (let key in allUsers) {
                    if (allUsers.hasOwnProperty(key)) {
                        if (allUsers[key]["socket"].id === socket.id) {
                            auth.updateUserStatus(key, "offline").then(() => console.log("Update status offline succesfully"));
                            console.log('Got disconnect! : ' + socket.id);
                            console.log('User id! : ' + key + "\n");
                            delete allUsers[key];
                        }
                    }
                }
                //const i = allUsers.indexOf(socket);
                //allUsers.splice(i, 1);
            });
        });

    })
};
