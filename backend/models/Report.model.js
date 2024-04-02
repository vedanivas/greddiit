const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema({
  Concern: { type: String, required: true },
  Post:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Posts'
  }
  ,
  By:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
  ,
  On:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date:{type:Date,required:true},
  Ignored : { type: Boolean },
  creationdate:{type:Number}
})

ReportSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
  }
})

const Report = mongoose.model('Report', ReportSchema)

module.exports = Report