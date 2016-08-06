const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.ObjectId, required: true, ref: 'User'},
  name: String,
  cost: Number,
  time_left: Number,
  amount_left: Number,
  monthly_budget: Number
})

const Item = mongoose.model('Item', itemSchema)

module.exports = Item
