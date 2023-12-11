const { User, Subgreddiit, Post } = require("./schemas.js")

function all(req, res) {
    Subgreddiit.find({}, (err, docs) => {
        if (err) {
            console.log(err)
        }
        else res.send({ status: "OK", info: docs })
    })
}

async function one(req, res) {
    const subg = await Subgreddiit.findById(req.params.sub_id);
    const user = await User.findById(req.body.id.toString())
   
    const info = [] 
    for (let i = 0; i < subg.posts.length; i++) {
        let upvoted = false
        let downvoted = false
        let following = false
        let saved = false
        
        const post = await Post.findById(subg.posts[i].toString())
        post.upvotes.find((each) => { return each.equals(req.body.id) }) ? upvoted = true : upvoted = false
        post.downvotes.find((each) => { return each.equals(req.body.id) }) ? downvoted = true : downvoted = false

        user.following.find((each) => { return each.equals(post.user._id) }) ? following = true : following = false
        if (user._id.equals(post.user._id) && following === false) following = true 

        user.saved.find((each) => { return each.equals(post._id) }) ? saved = true : saved = false
        
        info.push({post: post, upvoted: upvoted, downvoted: downvoted, following: following, saved: saved})
    }
    res.send({status: "OK", posts: info, subg: subg})
}

module.exports = {
    all,
    one
}