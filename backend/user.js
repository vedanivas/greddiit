const mongoose = require('mongoose')
const { User, Subgreddiit, Post } = require("./schemas.js")

function join(req, res) {
    Subgreddiit.findById(req.body.subgreddiit_id, (err, doc) => {
        if (err) {
            console.log(err)
        }
        else {
            doc.requests.push(req.body.user)
            doc.save((err, doc) => {
                if (err) {
                    console.log(err)
                }
            })
        }
    })
}

function leave(req, res) {
    Subgreddiit.findById(req.body.subgreddiit_id, (err, subg) => {
        if (err) {
            console.log(err)
        }
        else {

            User.findOne(req.body.user, (err, doc) => {
                if (err) {
                    console.log(err)
                }
                else {

                    newMembers = subg.members.filter((each) => {
                        return !(each._id.equals(doc._id))
                    })
                    subg.members = newMembers
                    subg.save((err, doc) => {
                        if (err) {
                            console.log(err)
                        }
                        else res.send({ status: "OK" })
                    })
                }
            })
        }
    })
}

function create(req, res) {
    const newPost = new Post({
        content: req.body.content,
        subg: mongoose.Types.ObjectId(req.params.sub_id),
        user: req.body.user,
        upvotes: req.body.upvotes,
        downvotes: req.body.downvotes
    })

    newPost.save((err, post) => {
        if (err) {
            console.log(err)
        }
        else {
            Subgreddiit.findById(req.params.sub_id, (err, doc) => {
                if (err) {
                    console.log(err)
                }
                else {
                    doc.posts.push(post._id)
                    doc.save((err, doc) => {
                        if (err) {
                            console.log(err)
                        }
                        else res.send({ status: "OK", info: post })
                    })
                }
            })
        }
    })
}

function ups(req, res) {
    const id = mongoose.Types.ObjectId(req.body.id)

    Post.findById(req.params.post_id, (err, doc) => {
        if (err) {
            console.log(err)
        }
        else {
            if (!req.body.upstat) {
                    doc.upvotes.push(id)
                    doc.save((err, doc) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log(doc)
                            res.send({ status: "OK" })
                        }
                    })
            }
            else {
                doc.upvotes = doc.upvotes.filter((each) => {
                    return !(each.equals(id))
                })
                doc.save((err, doc) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log(doc)
                        res.send({ status: "NOK" })
                    }
                })
            }
        }
    })
}

function downs(req, res) {
    const id = mongoose.Types.ObjectId(req.body.id)

    Post.findById(req.params.post_id, (err, doc) => {
        if (err) {
            console.log(err)
        }
        else {
            if (!req.body.downstat) {
                    doc.downvotes.push(id)
                    doc.save((err, doc) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log(doc)
                            res.send({ status: "OK" })
                        }
                    })
            }
            else {
                doc.downvotes = doc.downvotes.filter((each) => {
                    return !(each.equals(id))
                })
                doc.save((err, doc) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log(doc)
                        res.send({ status: "NOK" })
                    }
                })
            }
        }
    })
}

async function follow(req, res) {
    const my_id = mongoose.Types.ObjectId(req.body.my_id)
    const o_id = mongoose.Types.ObjectId(req.body.o_id)

    User.findById(my_id.toString(), (err, me) => {
        if (err) {
            console.log(err)
        }
        else {
            User.findById(o_id.toString(), (err, other) => {
                if (err) {
                    console.log(err)
                }
                else {
                    me.following.push(other._id)
                    me.save((err, new_me) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            other.followers.push(new_me._id)
                            other.save((err, new_other) => {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    res.send({ status: "OK" })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

function save(req, res) {
    const id = mongoose.Types.ObjectId(req.body.id)
    const post_id = mongoose.Types.ObjectId(req.body.post_id)

    User.findById(id.toString(), (err, doc) => {
        if (err) {
            console.log(err)
        }
        else {
            doc.saved.push(post_id)
            doc.save((err, doc) => {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send({ status: "OK" })
                }
            })
        }
    })
}

function unsave(req, res) {
    const id = mongoose.Types.ObjectId(req.params.user_id)
    const post_id = mongoose.Types.ObjectId(req.body.post_id)

    User.findById(id.toString(), (err, doc) => {
        if (err) {
            console.log(err)
        }
        else {
            doc.saved = doc.saved.filter((each) => {
                return !(each.equals(post_id))
            })
            doc.save((err, doc) => {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send({ status: "OK" })
                }
            })
        }
    })
}

module.exports = {
    join,
    leave,
    create,
    ups,
    downs,
    follow,
    save,
    unsave
}
