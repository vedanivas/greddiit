const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User.model')

loginRouter.post('/', async (request, response) => {
  const { Email, password } = request.body
  if (!Email) {
    return response.status(400).json({
      error: 'Email is empty in Login'
    })
  }
  if (!password) {
    return response.status(400).json({
      error: 'Password is empty in Login'
    })
  }
  const user = await User.findOne({ Email })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }
  const userForToken = {
    Email: user.Email,
    id: user._id,
  }
  const token = jwt.sign(userForToken, process.env.SECRET)
  console.log({ token, Email: user.Email, id: user._id, ...user })
  response
    .status(200)
    .send({ token, Email: user.Email, id: user._id, FirstName: user.FirstName, LastName: user.LastName, Username: user.Username, Age: user.Age, ContactNumber: user.ContactNumber, Following: user.Following, Followers: user.Followers, SavedPosts: user.SavedPosts, _id: user._id })
})

module.exports = loginRouter