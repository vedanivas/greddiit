const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  FirstName:{type:String,required:true},
  LastName:{type:String,required:true},
  Username: {type:String,required:true},
  Email:{type:String,required:true,unique:true},
  Age:{type:Number,required:true},
  ContactNumber:{type:String,required:true},
  passwordHash: {type:String,required:true},
  Following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  Followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  SavedPosts:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Posts'
    }
  ],
  creationdate:{type:Number}
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User