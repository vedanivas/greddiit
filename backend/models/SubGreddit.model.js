const mongoose = require('mongoose')

const SubGredditSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Description: { type: String, required: true },
    Tags: [
        {
            type: String,
        }
    ],
    Banned: [
        {
            type: String,
        }
    ],
    Moderator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
    Post: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Posts'
        }
    ],
    Reports: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Report'
        }
    ],
    date: { type: Date, required: true },
    Followed: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
    JoinRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    Blocked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    GrowthData: [
        {
            date: { type: Date, required: true },
            User: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            Join: { type: Boolean }
        }
    ],
    ClickGrowthData: [
        { type: Date }
    ],
    PostGrowthData: [
            {
                date: { type: Date, required: true },
                Post: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Posts'
                }
            } 
    ],
    Reported: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Report'
        }
    ],
    Clicks: [{ type: Date }],
    creationdate:{ type: Number },
    ImageURL:{type:String}
})

SubGredditSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject.__v
    }
})

const SubGreddit = mongoose.model('SubGreddit', SubGredditSchema)

module.exports = SubGreddit