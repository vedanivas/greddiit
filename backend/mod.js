const mongoose = require('mongoose')
const { Subgreddiit } = require("./schemas.js")

function createSubg(req, res) {
    const members = [req.body.moderator]
    const newSubgreddiit = new Subgreddiit({
        name: req.body.name,
        description: req.body.description,
        banned: req.body.banned.split(","),
        moderator: mongoose.Types.ObjectId(req.body.moderator._id),
        members: members,
        requests: [],
        posts: []
    })
    newSubgreddiit.save((err, doc) => {
        if (err) {
            console.log(err)
        }
        else res.send({ status: "ok", info: doc })
    })
}

function delSubg(req, res) {
    const id = mongoose.Types.ObjectId(req.body)
    Subgreddiit.findByIdAndDelete(id, (err, doc) => {
        if (err) {
            console.log(err)
        }
        else res.send("ok")
    })
}

function accept(req, res) {
    Subgreddiit.findById(req.params.sub_id, (err, doc) => {
        if (err) {
            console.log(err)
        }
        else {
            const newMember = doc.requests.filter((each) => {
                const id = each._id
                return (id.toString() === req.body.user_id)
            })

            doc.members.push(...newMember)
            const index = doc.requests.indexOf(...newMember);
            if (index > -1) {
                doc.requests.splice(index, 1);
            }
            doc.save((err, doc) => {
                if (err) {
                    console.log(err)
                }
            })
            res.send({ status: "OK", info: doc.requests })
        }
    })
}

function reject(req, res) {
    Subgreddiit.findById(req.params.sub_id, (err, doc) => {
        if (err) {
            console.log(err)
        }
        else {
            const newMember = doc.requests.filter((each) => {
                const id = each._id
                return (id.toString() === req.body.user_id)
            })

            const index = doc.requests.indexOf(...newMember);
            if (index > -1) {
                doc.requests.splice(index, 1);
            }

            doc.save((err, doc) => {
                if (err) {
                    console.log(err)
                }
            })
            res.send({ status: "OK", info: doc.requests })
        }
    })
}

module.exports = {
    createSubg,
    delSubg,
    accept,
    reject
}