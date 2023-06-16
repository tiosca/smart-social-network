use quickMess
//db.users.deleteMany({role: "user"})


//_-----------------------USERS
db.users.findOne({username: "enaki1"})
db.users.deleteOne({username: "catalin"})

db.users.update(
   { username: "artur" },
   { $set: { profileImagePath: "images/artur.jpeg" } }
)

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

