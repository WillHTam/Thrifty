const Goal = require('../models/goal')
const User = require('../models/user')

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

var request = require('request-json')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

function showAllGoals (req, res, err) {
  Goal.find({}, function (err, goals) {
    res.status(200).json(goals)
  })
}

function showUserGoals (req, res) {
  const userEmail = req.get('email')
  const authToken = req.get('auth_token')
  // const userParams = new User(req.body)
  User.findOne({email: userEmail}, function (err, user) {
    if (err) return res.status(401).json({error: 'ERROR! User not found.'})
    Goal.find({user}, function (err, goal) {
      if (err) return res.status(401).json({error: 'Error finding goal'})
      res.status(200).json(goal)
    })
  })
}

function newGoal (req, res) {
  var goal = new Goal(req.body)
  const userEmail = req.get('email')
  const authToken = req.get('auth_token')

  User.findOne({email: userEmail}, (err, user) => {
    if (err || !user) return res.status(401).json({error: 'Unable to find user'})
    goal.user = user
    goal.save((err, goal) => {
      if (err) return res.status(401).json({error: 'Error saving goal!'})
      res.status(201).json({message: 'Goal created!', goal})
    })
  })
}

function updateGoal (req, res) {
  const goalid = req.get('id')
  const userEmail = req.get('email')
  const authToken = req.get('auth_token')

  User.findOne({email: userEmail}, (err, user) => {
    if (err || !user) return res.status(401).json({error: 'Unable to find user'})

    Goal.findById(goalid, (err, goal) => {
      if (err) return res.status(401).json({error: 'Cannot find goal.'})
      goal.name = req.body.name || goal.name
      goal.cost = req.body.cost || goal.cost
      goal.time_left = req.body.time_left
      goal.amount_left = req.body.amount_left || goal.amount_left
      goal.monthly_budget = req.body.monthly_budget || goal.monthly_budget
      goal.icon = req.body.icon || goal.icon
      goal.save((err) => {
        if (err) return res.status(401).json({error: err})
        res.status(200).json({message: 'Goal updated', goal})
      })
    })

  })
}

function getOneGoal (req, res, err) {
  const id = req.params.id
  Goal.find({_id: id}, function (err, goal) {
    if (err) return res.status.json({error: 'get one goal failed'})
    res.status(200).json(goal)
  })
}
// function editOneGoal
// function deleteOneGoal

function deleteGoal (req, res, err) {
  const goalid = req.get('id')
  const userEmail = req.get('email')
  const authToken = req.get('auth_token')

  User.findOne({email: userEmail, auth_token: authToken}, (err, user) => {
    if (err || !user) return res.status(401).json({error: 'User not found (deleteGoal)'})
    else {
      Goal.findById(goalid, (err, goal) => {
        if (err) return res.status(401).json({error: "Goal not found"})
        else {
          goal.remove()
          res.status(200).json({message: 'Goal deleted'})
        }
      })
    }
  })
}

module.exports = {
  showAllGoals: showAllGoals,
  showUserGoals: showUserGoals,
  newGoal: newGoal,
  updateGoal: updateGoal,
  deleteGoal: deleteGoal,
  getOneGoal: getOneGoal
}
