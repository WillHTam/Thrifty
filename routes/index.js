var express = require('express')
var router = express.Router()
var userController = require('../controllers/user_controller')
var goalController = require('../controllers/goal_controller')
var User = require('../models/user')
const bodyParser = require('body-parser')
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', function (req, res, next) {
  res.status(200)
  res.render('../views/index.ejs')
})

router.post('/newgoal', goalController.newGoal)

/* POST new user */
router.post('/register', userController.userRegister)

/* EDIT new user get started (after registration) */
router.post('/getstarted', userController.editUser)
/* EDIT user account */
router.put('/account', userController.editUser)

// User LOGIN
router.post('/login', userController.userLogIn)

// posts !!AND!! user DELETE
router.delete('/deleteUser', userController.deleteUser)

module.exports = router
