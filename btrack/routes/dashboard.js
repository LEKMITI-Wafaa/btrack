const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { route } = require('./login');
const Bug = require('../models/Bugs.model.js'); 
const User = require('../models/User.model.js');
const Service= require('../models/Services.model.js');

// route d'affichege de la dashboard:
router.get('/', (req, res, next) =>{
  let user = req.session.user;
if (req.session.user) { 
  Bug.find({})
  .populate('rapporter')
  .lean()
  .then(allBugsFromDB => {
    res.render('account/dashboard', {allBugsFromDB, user})
  })
} else {res.redirect('/login')}
})

// route de supprission de Bug
router.get('/:id/delete', (req, res, next) => {
  if (req.session.user) {
    Bug.findByIdAndDelete(req.params.id)
          .then(() => {
            res.redirect('/dashboard')
          })
          .catch(err => next(err))
  } else { res.redirect('/login') }
})

module.exports = router;