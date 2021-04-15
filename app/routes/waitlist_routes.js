const express = require('express')
const passport = require('passport')

const Waitlist = require('../models/waitlist')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX
// GET /waitlists
router.get('/waitlists', (req, res, next) => {
  Waitlist.find()
    .then(waitlists => {
      return waitlists.map(waitlist => waitlist.toObject())
    })
    .then(waitlists => res.status(200).json({ waitlists: waitlists }))
    .catch(next)
})

// SHOW
// GET /waitlists/5a7db6c74d55bc51bdf39793
router.get('/waitlists/:id', (req, res, next) => {
  Waitlist.findById(req.params.id)
    .then(handle404)
    .then(waitlist => res.status(200).json({ waitlist: waitlist.toObject() }))
    .catch(next)
})

// CREATE
// POST /waitlists
router.post('/waitlists', requireToken, (req, res, next) => {
  req.body.waitlist.owner = req.user.id

  Waitlist.create(req.body.waitlist)
    .then(waitlist => {
      res.status(201).json({ waitlist: waitlist.toObject() })
    })
    .catch(next)
})

// UPDATE
// PATCH /waitlists/5a7db6c74d55bc51bdf39793
router.patch('/waitlists/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.waitlist.owner

  Waitlist.findById(req.params.id)
    .then(handle404)
    .then(waitlist => {
      requireOwnership(req, waitlist)
      return waitlist.updateOne(req.body.waitlist)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /waitlists/5a7db6c74d55bc51bdf39793
router.delete('/waitlists/:id', requireToken, (req, res, next) => {
  Waitlist.findById(req.params.id)
    .then(handle404)
    .then(waitlist => {
      requireOwnership(req, waitlist)
      waitlist.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
