/* =======================
    LOAD THE DEPENDENCIES
==========================*/
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')

/* =======================
    LOAD THE CONFIG
==========================*/
const config = require('./config')
const port = process.env.PORT || 3000

/* =======================
    EXPRESS CONFIGURATION
==========================*/
const app = express()

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// print the request log on console
app.use(morgan('dev'))

// set the secret key variable for jwt
app.set('jwt-secret', config.secret)

// index page, just for testing
app.get('/', (req, res) => {
  res.send('Hello JWT')
})

// open the server
app.listen(port, () => {
  console.log(`Express is running on port ${port}`)
})

/* =======================
    CONNECT TO MONGODB SERVER
==========================*/
mongoose.connect(config.db_url, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'mongoose connection error.'))
db.once('open', () => {
  console.log('connected to mongodb server. : ' + config.db_url)
})
