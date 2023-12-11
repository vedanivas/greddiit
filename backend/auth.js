const { User } = require("./schemas.js")

// register
function reg(req, res) {
    const newUser = new User(req.body)
    newUser.save()
    res.send("Success")
}

function login(req, res) {
    User.findOne(req.body, (err, doc) => {
        if (err) {
            console.log(err)
        }
        else {
            if (doc === null) res.send("fail")
            else res.send({ status: "ok", details: doc })
        }
    })
}

module.exports = {reg, login}