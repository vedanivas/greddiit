// Module Dependencies
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const auth = require("./auth")
const profile = require("./profile")
const mod = require("./mod")
const user = require("./user")
const disAll = require("./disSubg")
const disMy = require("./disMySubg")

// Configuration 
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Authentication
app.post("/api/login", auth.login)
app.post("/api/register", auth.reg)


// Profile
app.post("/api/editprofile", profile.edit)
app.get("/api/profilelists/:user_id/:title", profile.lists)
app.get("/api/deleteuser/:my_id/:title/:o_id", profile.del)


// Moderator
app.post("/api/createsubgreddiit", mod.createSubg)
app.post("/api/delsubgreddiit", mod.delSubg)
app.post("/api/acceptance/:sub_id", mod.accept)
app.post("/api/decline/:sub_id", mod.reject)


// Rendering My Subgreddiits
app.post("/api/allmysubgreddiits", disMy.all)
app.get("/api/my-subgreddiits/:id", disMy.one)
app.get("/api/requests/:sub_id", disMy.requests)
app.get("/api/savedposts/:user_id", disMy.saved)


// Rendering Subgreddiits
app.get("/api/allsubgreddiits", disAll.all)
app.post("/api/subgreddiits/:sub_id", disAll.one)


// User
app.post("/api/joinrequest", user.join)
app.post("/api/leave", user.leave)
app.post("/api/createpost/:sub_id", user.create)
app.post("/api/ups/:post_id", user.ups)
app.post("/api/downs/:post_id", user.downs)
app.post("/api/follow", user.follow)
app.post("/api/save", user.save)
app.post("/api/unsave/:user_id", user.unsave)


app.listen(5000, () => {
    console.log("Server started on port 5000")
})