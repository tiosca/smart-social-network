const utilities = require('./../utilities');
const fetch = require("node-fetch");
const config = require('./../config/config');

const apiUrl = config.apiUrl;

module.exports = {
    insertMessage: async function (user_1, user_2, message) {
        console.log(message);
        const options = {
            method: "POST",
            body: JSON.stringify(message),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }

        return new Promise((resolve, reject) => {
            fetch(`${apiUrl}api/chat/messages`, options)
                .then((res) => {
                    resolve();
                })
                .catch((err) => {
                    throw err;
                });
        });
    },
    insertChat: async function (user_1, user_2) {
        const options = {
            method: "DELETE",
            body: JSON.stringify({
                "userId1": user_1,
                "userId2": user_2,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }

        return new Promise((resolve, reject) => {
            fetch(`${apiUrl}api/chat`, options)
                .then((res) => {
                    resolve();
                })
                .catch((err) => {
                    throw err;
                });
        });
    },
    getMessages: async function (user_1, user_2) {
        return new Promise((resolve, reject) => {
            const url = `${apiUrl}api/chat/by-users?userId1=${user_1}&userId2=${user_2}`;
            console.log(url);
            fetch(url)
                .then((res) => {
                    if (res.status >= 400){
                        resolve();
                        return;
                    }
                    return res.json()
                })
                .then((jsonRes) => {
                    resolve(jsonRes);
                })
                .catch((err) => {
                    throw err;
                });
        });
    },
}
