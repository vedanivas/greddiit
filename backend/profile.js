const mongoose = require('mongoose')
const { User } = require("./schemas.js")

function edit(req, res) {
    const id = req.body._id
    delete req.body["_id"]
    User.findByIdAndUpdate(id, req.body, (err, doc) => {
        if (err) {
            console.log(err)
        }
        else res.send({ status: "ok", details: doc })
    })
}

function lists(req, res) {
    const id = mongoose.Types.ObjectId(req.params.user_id)
    User.findById(id.toString(), async (err, doc) => {
        if (err) {
            console.log(err)
        }
        else {
            const info = []
            let datas = []
            if (req.params.title === "Followers") datas = doc.followers
            else datas = doc.following

            for (let i = 0; i < datas.length; i++) {
                const user = await User.findById(datas[i].toString())
                info.push({ _id: user._id, fname: user.fname, lname: user.lname, uname: user.uname })
            }
            res.send({ status: "OK", info: info })
        }
    })
}

function del(req, res) {
    const my_id = mongoose.Types.ObjectId(req.params.my_id)
    const o_id = mongoose.Types.ObjectId(req.params.o_id)

    User.findById(my_id.toString(), (err, doc) => {
        if (err) {
            console.log(err)
        }
        else {
            let data = []
            if (req.params.title === "Followers") data = doc.followers
            else data = doc.following

            const index = data.indexOf(o_id)
            if (index > -1) data.splice(index, 1)
            doc.save((err, doc) => {
                if (err) {
                    console.log(err)
                }
                else {

                    User.findById(o_id.toString(), (err, doc) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            let data = []
                            if (req.params.title === "Followers") data = doc.following
                            else data = doc.followers

                            const index = data.indexOf(my_id)
                            if (index > -1) data.splice(index, 1)
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
            })
        }
    })
}

module.exports = {
    edit,
    lists,
    del
}