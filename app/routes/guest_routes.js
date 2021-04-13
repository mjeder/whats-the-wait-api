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
// GET /guests
router.get('/guests', requireToken, (req, res, next) => {
  Waitlist.find()
    .then(guests => {
      return guests.map(guest => guest.toObject())
    })
    .then(guests => res.status(200).json({ guests: guests }))
    .catch(next)
})

// SHOW
// GET /guests/5a7db6c74d55bc51bdf39793
router.get('/guests/:id', requireToken, (req, res, next) => {
  Waitlist.findById(req.params.id)
    .then(handle404)
    .then(guest => res.status(200).json({ guest: guest.toObject() }))
    .catch(next)
})

// CREATE
// POST /guests
router.post('/guests', requireToken, (req, res, next) => {
  req.body.guest.owner = req.user.id
  const data = req.body.guest
  const waitlistId = data.waitlistId
  Waitlist.findById(waitlistId)
    .then(handle404)
    .then(waitlist => {
      waitlist.guests.push(data)
      return waitlist.save()
    })
    .then(waitlist => res.status(201).json({waitlist: waitlist}))
    .catch(next)
})

// UPDATE
// PATCH /guests/5a7db6c74d55bc51bdf39793
router.patch('/guests/:id', requireToken, removeBlanks, (req, res, next) => {
  // delete req.body.guest.owner
  const guestId = req.params.id
  const data = req.body.guest
  const waitlistId = data.waitlistId
  Waitlist.findById(waitlistId)
    .then(handle404)
    .then(waitlist => {
      const guest = waitlist.guests.id(guestId)
      guest.set(data)
      return waitlist.save()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /guests/5a7db6c74d55bc51bdf39793
router.delete('/guests/:id', requireToken, (req, res, next) => {
  Waitlist.findById(req.params.id)
    .then(handle404)
    .then(guest => {
      requireOwnership(req, guest)
      guest.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
