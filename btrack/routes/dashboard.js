const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { route } = require('./login');
const Bug = require('../models/Bugs.model.js');
const User = require('../models/User.model.js');
const Service = require('../models/Services.model.js');
const routeGuard = require('../configs/route-guard.config');
const moment = require('moment')

// route d'affichege de la dashboard:
router.get('/', routeGuard, (req, res, next) => {
  let user = req.session.user;
  Bug.find({})
    .populate('rapporter')
    .lean()
    .then(allBugsFromDB => {
      const bugs = allBugsFromDB.map(bug => {
        const normalizedBug = {
          ...bug,
          rapportedAt: {
            rapportDay: moment(bug.rapportedAt).format('ll'),
            rapportTime: moment(bug.rapportedAt).format('LT')
          }
        }

        return normalizedBug
      })
      res.render('account/dashboard', { bugs, user })


    })

})

// route de supprission de Bug
router.get('/:id/delete', routeGuard, (req, res, next) => {
  Bug.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect('/dashboard')
    })
    .catch(err => next(err))
})

module.exports = router;