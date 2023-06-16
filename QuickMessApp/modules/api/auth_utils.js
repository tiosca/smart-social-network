const utilities = require('./../utilities');
const config = require('./../config/config');
const fetch = require('node-fetch');

const apiUrl = config.apiUrl;

const getUserBasicInfoMap = function(users){
    return users.map(function (user) {
        return {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            age: utilities.calculateAge(user.birthDay),
            status: user.status,
            city: user.city,
            country: user.country,
            profileImagePath: user.profileImagePath,
        };
    })
}

module.exports = {
    getUser: async function (username, password) {
        return new Promise((resolve, reject) => {
            fetch(`${apiUrl}api/user/auth?username=${username}&password=${password}`)
                .then((res) => {
                    if (res.status > 400){
                        resolve(null);
                        return;
                    }
                    return res.json()
                })
                .then((jsonData) => {
                    resolve(jsonData);
                })
                .catch((err) => {
                    throw err;
                });
        });
    },

    getUserById: async function (id) {
        return new Promise((resolve, reject) => {
            fetch(`${apiUrl}api/user/${id}`)
                .then((res) => {
                    if (res.status > 400){
                        resolve(null);
                        return;
                    }
                    return res.json()
                })
                .then((jsonData) => {
                    resolve(jsonData);
                })
                .catch((err) => {
                    throw err;
                });
        });
    },

    insertUser: async function (user) {
        const options = {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }

        return new Promise((resolve, reject) => {
            fetch(`${apiUrl}api/user`, options)
                .then((res) => {
                    resolve();
                })
                .catch((err) => {
                    throw err;
                });
        });
    },

    insertPostMessage: async function (post) {
        console.log(post)
        const options = {
            method: "POST",
            body: JSON.stringify(post),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }
        console.log(options)


        return new Promise((resolve, reject) => {
            fetch(`${apiUrl}api/post`, options)
                .then((res) => {
                    resolve();
                })
                .catch((err) => {
                    throw err;
                });
        });
    },

    insertFriendRequest: async function (user_id, user_who_requested_friendship) {
        const options = {
            method: "POST",
            body: JSON.stringify({
                "userId1": user_id,
                "userId2": user_who_requested_friendship,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }

        return new Promise((resolve, reject) => {
            fetch(`${apiUrl}api/friendship/friend-requests`, options)
                .then((res) => {
                    resolve();
                })
                .catch((err) => {
                    throw err;
                });
        });
    },

    getFriendRequestsById: async function (user_id) {
        return new Promise((resolve, reject) => {
            fetch(`${apiUrl}api/friendship/friend-requests/${user_id}`)
                .then((res) => {
                    if (res.status > 400){
                        resolve(null);
                        return;
                    }
                    return res.json()
                })
                .then((jsonData) => {
                    resolve(jsonData);
                })
                .catch((err) => {
                    throw err;
                });
        });
    },

    getFriendsById: async function (user_id) {
        return new Promise((resolve, reject) => {
            fetch(`${apiUrl}api/friendship/friends/${user_id}`)
                .then((res) => {
                    if (res.status > 400){
                        resolve(null);
                        return;
                    }
                    return res.json()
                })
                .then((jsonData) => {
                    resolve(jsonData);
                })
                .catch((err) => {
                    throw err;
                });
        });
    },

    clearFriendRequest: async function(user_id, user_who_requested_friendship){
        const options = {
            method: "DELETE",
            body: JSON.stringify({
                "userId1": user_id,
                "userId2": user_who_requested_friendship,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }

        return new Promise((resolve, reject) => {
            fetch(`${apiUrl}api/friendship/friend-requests`, options)
                .then((res) => {
                    resolve();
                })
                .catch((err) => {
                    throw err;
                });
        });
    },

    removeFriendship: async function(user_id, user_who_requested_remove_friendship){
        const options = {
            method: "DELETE",
            body: JSON.stringify({
                "userId1": user_id,
                "userId2": user_who_requested_remove_friendship,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }

        return new Promise((resolve, reject) => {
            fetch(`${apiUrl}api/friendship`, options)
                .then((res) => {
                    resolve();
                })
                .catch((err) => {
                    throw err;
                });
        });
    },

    updateUserStatus: async function(id, status){
        const options = {
            method: "PATCH",
            body: JSON.stringify({
                "status": status,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }

        return new Promise((resolve, reject) => {
            fetch(`${apiUrl}api/user/${id}`, options)
                .then((res) => {
                    resolve();
                })
                .catch((err) => {
                    throw err;
                });
        });
    },

    insertFriendship(user_id, user_who_requested_friendship){
        const options = {
            method: "POST",
            body: JSON.stringify({
                "userId1": user_id,
                "userId2": user_who_requested_friendship,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }

        return new Promise((resolve, reject) => {
            fetch(`${apiUrl}api/friendship`, options)
                .then((res) => {
                    resolve();
                })
                .catch((err) => {
                    throw err;
                });
        });
    },

    getUserPostsById: async function (id) {
        return new Promise((resolve, reject) => {
            fetch(`${apiUrl}api/post/${id}`)
                .then((res) => {
                    if (res.status > 400){
                        resolve(null);
                        return;
                    }
                    return res.json()
                })
                .then((jsonData) => {
                    resolve(jsonData);
                })
                .catch((err) => {
                    throw err;
                });
        });
    },

    getUsersBasicInfo: async function () {
        return new Promise((resolve, reject) => {
            fetch(`${apiUrl}api/user`)
                .then((res) => {
                    if (res.status > 400){
                        resolve(null);
                        return;
                    }
                    return res.json()
                })
                .then((jsonData) => {
                    resolve(getUserBasicInfoMap(jsonData));
                })
                .catch((err) => {
                    throw err;
                });
        });

    },

    getUsersBasicInfoByMultipleIds: async function (ids) {
        return new Promise((resolve, reject) => {
            if (ids.length === 0){
                resolve([]);
                return;
            }
            fetch(`${apiUrl}api/user/multiple?ids=${ids.join(",")}`)
                .then((res) => {
                    if (res.status > 400){
                        resolve(null);
                        return;
                    }
                    return res.json()
                })
                .then((jsonData) => {
                    resolve(getUserBasicInfoMap(jsonData));
                })
                .catch((err) => {
                    throw err;
                });
        });
    },

    removePost: async function(user_id, post_id){
        const options = {
            method: "DELETE",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }

        return new Promise((resolve, reject) => {
            fetch(`${apiUrl}api/users/${user_id}/posts/${post_id}`, options)
                .then((res) => {
                    resolve();
                })
                .catch((err) => {
                    throw err;
                });
        });
    },
}
