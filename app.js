const express = require('express')
const bodyParser =  require('body-parser')
const ejs = require('ejs')

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI)

const logger = require('morgan')
const userController = require('./controllers/user_controller')
const port = process.env.PORT || 4200
var routes = require('./routes/index')

const app = express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))

const User = require('./models/user')

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, email, auth_token, id')
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE')
  next()
})

app.use('/', routes)

app.listen(port, () => {
	console.log(`Connected to ${port}`)
})

module.exports = app
