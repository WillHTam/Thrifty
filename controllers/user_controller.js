const User = require('../models/user')

function userRegister (req, res, next) {
  const user = new User(req.body)
  user.save((err, user) => {
    if (err) return res.status(401).json({error: 'ERROR! Could not create user.'})
    res.status(201).json({message: 'User created.', auth_token: user.auth_token})
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

function userFind (req, res, next) {
  User.findOne({first_name: 'Justin'}, (err, user) => {
    if (err || !user) return res.status(401).json({error: 'Cannot find user'})
  })
}

function editUser(req, res, next) {
  User.findOne({auth_token: req.get('auth_token')}, (err, user) => {
    if (err) res.status(401).json({error: 'Cannot find user'})
    else {
      user.email = req.body.email
      user.password = req.body.password
      user.monthly_income = req.body.monthly_income
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
  const userEmail = req.body.user.email
  User.findOne({email: userEmail}, (err, user) => {
    if (err || !user) return res.status(401).json({error: 'Email or password is invalid'})
    Goal.find({user}).remove().exec()
    user.remove()
    res.status(200).json({message: 'User and Goals deleted'})
    next()
  })
}

module.exports = {
  userRegister: userRegister,
  userLogIn: userLogIn,
  userFind: userFind,
  userLoggedIn: userLoggedIn,
  editUser: editUser,
  deleteUser: deleteUser
}
