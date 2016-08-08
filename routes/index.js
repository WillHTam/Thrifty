var express = require('express')
var router = express.Router()
var applicationController = require('../controllers/user_controller')
var User = require('../models/user')
const bodyParser = require('body-parser')
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', function (req, res, next) {
  res.status(200)
  res.render('../views/index.ejs')
})

/* POST new user */
router.post('/register', applicationController.userRegister)

/* EDIT user */
router.post('/getstarted', applicationController.editUser)
router.put('/account', applicationController.editUser)

// User LOGIN
router.post('/login', applicationController.userLogIn)

// posts !!AND!! user DELETE
router.delete('/deleteUser', applicationController.deleteUser)

module.exports = router
