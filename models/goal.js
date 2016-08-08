const mongoose = require('mongoose')

const goalSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.ObjectId, required: true, ref: 'User'},
  icon: String,
  name: String,
  cost: Number,
  time_left: Number,
  amount_left: Number,
  monthly_budget: Number
})

const Goal = mongoose.model('Goal', goalSchema)

module.exports = Goal
