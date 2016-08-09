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

// USERS

// GET my details from auth_token
router.get('/me', userController.whoMe)

/* ADD NEW user */
router.post('/register', userController.userRegister)

/* ADD user monthly income, on get started page (after registration) */
router.post('/getstarted', userController.editUser)

/* EDIT user account */
router.put('/account', userController.editUser)

// User LOGIN
router.post('/login', userController.userLogIn)

// DELETE user
router.delete('/deleteuser', userController.deleteUser)

// GOALS

// GET my (and only my) GOALS
router.get('/mygoals', goalController.showUserGoals)

// ADD NEW goal
router.post('/newgoal', goalController.newGoal)

// UPDATE goal profile
router.put('/editgoal', goalController.updateGoal)

// UPDATE goal plan
router.put('/editgoalplan', goalController.updateGoal)

// DELETE  goal
router.delete('/deletegoal', goalController.deleteGoal)


module.exports = router
