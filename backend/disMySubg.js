const mongoose = require('mongoose')
const { User, Subgreddiit, Post } = require("./schemas.js")

function all(req, res) {
    const id = mongoose.Types.ObjectId(req.body.id)
    Subgreddiit.find({ moderator: id }, (err, docs) => {
        if (err) {
            console.log(err)
        }
        else {
            res.send({ status: "OK", info: docs })
        }
    })
}

function one(req, res) {
    Subgreddiit.findById(req.params.id, (err, doc) => {
        if (err) {
            console.log(err)
            
        }
        else {
            const moderator = doc.members.filter((each) => { return (each._id.equals(doc.moderator)) })
            const others = doc.members.filter((each) => { return !(each._id.equals(doc.moderator)) })

            res.send({ status: "OK", info: { moderator: moderator, others: others } })
        }
    })
}

function requests(req, res) {
    Subgreddiit.findById(req.params.sub_id, (err, doc) => {
        if (err) {
            console.log(err)
        }
        else res.send({ status: "OK", info: doc.requests })

    })
}

async function saved(req, res) {
   const user = await User.findById(req.params.user_id)

    const info = []
    for (let i = 0; i < user.saved.length; i++) {
        let upvoted = false
        let downvoted = false
        let following = false
        
        const post = await Post.findById(user.saved[i].toString())
        post.upvotes.find((each) => { return each.equals(req.params.user_id) }) ? upvoted = true : upvoted = false
        post.downvotes.find((each) => { return each.equals(req.params.user_id) }) ? downvoted = true : downvoted = false

        user.following.find((each) => { return each.equals(post.user._id) }) ? following = true : following = false
        if (user._id.equals(post.user._id) && following === false) following = true 
        
        const subg = await Subgreddiit.findById(post.subg.toString())

        info.push({post: post, upvoted: upvoted, downvoted: downvoted, following: following, saved: true, subg: subg.name})
    }

    res.send({status: "OK", posts: info})
}

module.exports = {
    all,
    one,
    requests,
    saved
}