const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const uuid = require('uuid')

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  auth_token: {type: String, unique: true},
  budget: Number,
  current_amount: Number,
  bankrupt: Boolean,
  progress: Number
})

userSchema.pre('save', function (next) {
  const user = this

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(8, function (err, salt) {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err)

      user.password = hash
      next()
    })
  })

  user.auth_token = uuid.v4()
})

userSchema.methods.authenticate = function (password, callback) {
  bcrypt.compare(password, this.password, callback)
}

const User = mongoose.model('User', userSchema)

module.exports = User
