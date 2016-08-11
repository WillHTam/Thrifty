const mongoose = require('mongoose')

const goalSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.ObjectId, required: true, ref: 'User'},
  icon: String,
  name: String,
  cost: Number,
  time_left: Number,
  amount_saved: Number,
  monthly_budget: Number,
  created_at: Date,
  updated_at: Date
})

goalSchema.pre('save', function (next) {
  let now = new Date()
  this.updated_at = now
  if (!this.created_at) {
    this.created_at = now
  }
  next()
})

const Goal = mongoose.model('Goal', goalSchema)

module.exports = Goal
