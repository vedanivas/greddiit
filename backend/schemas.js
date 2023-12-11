const mongoose = require('mongoose')
const uri = 'mongodb+srv://vedanivas:vedanivas@cluster0.hggindf.mongodb.net/Sample'
mongoose.set('strictQuery', false)
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Database connected!")).catch(err => console.log(err));

const { Schema } = mongoose

const userSchema = new Schema({
  fname: String,
  lname: String,
  uname: String,
  email: String,
  age: Number,
  contact: Number,
  password: String,
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  saved: [{ type: Schema.Types.ObjectId, ref: "Post" }]
})

const postSchema = new Schema({
  content: String,
  subg: {type: Schema.Types.ObjectId, ref: "Subgreddiit"},
  user: { type: userSchema, ref: "User" },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  // comments: {
  //   user: {type: userSchema, ref: "User"},
  //   text: String
  // }
})

const subgreddiitSchema = new Schema({
  moderator: { type: Schema.Types.ObjectId, ref: "User" },
  name: String,
  description: String,
  banned: [{ type: String }],
  members: [{ type: userSchema, ref: "User" }],
  requests: [{ type: userSchema, ref: "User" }],
  // blocked_members: [{type: Schema.Types.ObjectId, ref: "User"}],
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }]
})

const User = mongoose.model("users", userSchema)
const Subgreddiit = mongoose.model("subgreddiits", subgreddiitSchema)
const Post = mongoose.model("posts", postSchema)

module.exports = {
  User,
  Subgreddiit,
  Post
}