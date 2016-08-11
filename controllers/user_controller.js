//merge fix
const User = require('../models/user')
const Goal = require('../models/goal')

function whoMe (req, res, next) {
  const userMail = req.get('email')
  const authToken = req.get('auth_token')
  User.findOne({email: userMail, auth_token: authToken}, function (err, user) {
    if (err) return res.status(401).json({error: 'ERROR! User not found.'})
    res.status(200).json(user)
  })
}

function userRegister (req, res, next) {
  const user = new User(req.body)
  user.save((err, user) => {
    if (err) return res.status(401).json({error: 'ERROR! Could not create user.'})
    res.status(201).json({message: 'User created.', email: user.email, auth_token: user.auth_token})
    next()
  })
}

function userLogIn (req, res, next) {
  const userParams = new User(req.body)
  User.findOne({email: userParams.email}, (err, user) => {
    if (err || !user) return res.status(405).json({error: 'Cannot find user'})
    user.authenticate(userParams.password, (err, isMatch) => {
      if (err || !isMatch) return res.status(401).json({error: 'Password no match'})
      res.status(200).json({message: 'User logged in', email: user.email, auth_token: user.auth_token})
      next()
    })
  })
}

function userLoggedIn (req, res, next) {
  const userEmail = req.get('email')
  const authToken = req.get('auth_token')
  if (!userEmail || !authToken) return res.status(401).json({error: 'Unauthorised'})

  User.findOne({email: userEmail, auth_token: authToken}, (err, user) => {
    if (err || !user) return res.status(401).json({error: 'Unauthorised'})
    req.currentUser = user
    next()
  })
}

function editUser(req, res, next) {
  const userEmail = req.get('email')
  const authToken = req.get('auth_token')

  User.findOne({email: userEmail, auth_token: authToken}, (err, user) => {
    if (err) res.status(401).json({error: 'Cannot find user'})
    else {
      user.first_name = req.body.first_name || user.first_name
      user.last_name = req.body.last_name || user.last_name
      user.email = req.body.email || user.email
      user.password = req.body.password || user.password
      user.monthly_income = req.body.monthly_income || user.monthly_income
      user.save( function(err) {
        if (err) res.status(400).json({error: 'Cannot save user'})
        else {
          res.status(200).json({message: 'User successfully updated', auth_token: user.auth_token, email: user.email})
          next()
        }
      })
    }
  })
}

function deleteUser (req, res, next) {
  const userEmail = req.get('email')
  const authToken = req.get('auth_token')

  User.findOne({email: userEmail, auth_token: authToken}, (err, user) => {
    if (err || !user) return res.status(401).json({error: 'Email or password is invalid'})

    // removes goals if any exist
    if (Goal.find({user})) {
    Goal.find({user}).remove().exec()
    }

    user.remove()
    res.status(200).json({message: 'User and Goals deleted'})
    next()
  })
}

module.exports = {
  whoMe: whoMe,
  userRegister: userRegister,
  userLogIn: userLogIn,
  userLoggedIn: userLoggedIn,
  editUser: editUser,
  deleteUser: deleteUser
}
