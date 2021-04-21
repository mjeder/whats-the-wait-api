const express = require('express')
const passport = require('passport')

const Waitlist = require('../models/waitlist')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
// const requireOwnership = customErrors.requireOwnership

// const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// CREATE
router.post('/guests/:waitlistId', requireToken, (req, res, next) => {
  req.body.guest.owner = req.user.id
  const data = req.body.guest
  const waitlistId = req.params.waitlistId
  Waitlist.findById(waitlistId)
    .then(handle404)
    .then(waitlist => {
      waitlist.guests.push(data)
      return waitlist.save()
    })
    .then(waitlist => waitlist.guests.sort((a, b) => b.createdAt - a.createdAt)[0])
    .then(guest => res.status(201).json({guest: guest}))
    .catch(next)
})

// UPDATE
router.patch('/guests/:waitlistId/:guestId', (req, res, next) => {
  // delete req.body.guest.owner
  const guestId = req.params.guestId
  const waitlistId = req.params.waitlistId
  const data = req.body.guest
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
router.delete('/guests/:waitlistId/:guestId', (req, res, next) => {
  const guestId = req.params.guestId
  const waitlistId = req.params.waitlistId
  Waitlist.findById(waitlistId)
    .then(handle404)
    .then(waitlist => {
      waitlist.guests.id(guestId).remove()

      return waitlist.save()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
