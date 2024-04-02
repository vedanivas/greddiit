require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.ATLAS_URI
const SMTP_PASSWORD = process.env.SMTP_PASSWORD
const publicKey = process.env.IMAGEKIT_PUBLIC_KEY
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT
const TIME_PERIOD = process.env.TIME_PERIOD

module.exports = {
  MONGODB_URI,
  PORT,
  SMTP_PASSWORD,
  publicKey,
  privateKey,
  urlEndpoint,
  TIME_PERIOD
}