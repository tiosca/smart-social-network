use quickMess
//db.users.deleteMany({role: "user"})


//_-----------------------USERS
db.users.findOne({username: "tiosca"})

db.users.update(
   { username: "bucefal" },
   { $set: { profileImagePath: "images/bucefal.png" } }
)

db.users.update(
   {  username: "pedro" },
   { $set: { posts: [] } }
)

db.users.deleteOne(
   {  username: "test" }
)

db.users.updateMany(
   {  },
   { $set: { friendRequestsSentByMe: [], friendRequests: [] } }
)

db.users.updateMany(
   {  },
   { $unset: { friendRequestsSendByMe: [] } }
)

db.users.updateMany(
   { city: "Timisoara" },
   { $set: { city: "Timișoara" } }
)

