const express = require('express')
const cors = require('cors')
const db = require('./data/db.js')

const server = express()

server.listen(4000, () => {
   console.log('listening on port 4000...')
})

server.use(express.json())
server.use(cors())


// POST
server.post('/users', (req, res) => {
   const { name, bio } = req.body

   !(name && bio) ? res.status(400).json({ errorMessage: 'Please provide name and bio for the user.'}) :

   db.insert(req.body)
      .then(user => {
         res.status(201).json({ success: true, user })
      })
      .catch(err => {
         res.status(500).json({ error: 'There was an error while saving the user to the database', err })
      })
})


// GET
server.get('/users', (req, res) => {
   db.find()
      .then(users => {
         res.status(200).json({ success: true, users })
      })
      .catch(err => {
         res.status(500).json({ errorMessage: 'The users information could not be retrieved.', err })
      })
})


// GET with ID
server.get('/users/:id', (req, res) => {
   const { id } = req.params

   db.findById(id)
      .then(user => {
         user ? res.status(200).json({success: true, user}) :
         res.status(404).json({ message: 'The user with the specified ID does not exist.' })
      })
      .catch(err => {
         res.status(500).json({ success: false, errorMessage: 'The user information could not be retrieved.', err })
      })
})


// Delete
server.delete('/users/:id', (req, res) => {
   const { id } = req.params

   db.remove(id)
      .then(deleted => {
         deleted ? res.status(204).end : 
         res.status(404).json({ success: false, message: 'The user with the specified ID does not exist.' })
      })
      .catch(err => {
         res.status(500).json({ success: false,  errorMessage: 'The user could not be removed', err })
      })
})


// PUT
server.put('/users/:id', (req, res) => {
   const { id } = req.params
   const changes = req.body
   const { name, bio } = changes

   !(name && bio) ? res.status(400).json({ success: false, errorMessage: 'Please provide name and bio for the user.'}) :

   db.update(id, changes)
      .then(updated => {
         updated ? res.status(200).json({ success: true, updated }) :
         res.status(404).json({ success: false, message: 'The user with the specified ID does not exist.' })
      })
      .catch(err => res.status(500).json({ success: false, errorMessage: 'The user information could not be modified.', err }))
})