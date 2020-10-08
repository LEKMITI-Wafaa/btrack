const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { route } = require('./login');
const Bug = require('../models/Bugs.model.js'); 
const User = require('../models/User.model.js');


router.get('/:bugid', (req, res, next) =>{
  const id = req.params.bugid;
    Bug.findOne({_id: id})
    .populate('services')
    .populate('rapporter')
    .populate('user_id')
    .then((bug) => {
        // console.log('movie recuperé:', movie)
        res.render('account/bug-details', {
            bug
        })
    })
    .catch(err => next(err))

})

// route d'affichege de la dashboard:
router.get('/', (req, res, next) =>{
if (req.session.user) { 
  Bug.find({})
  .populate('rapporter')
  .then(allBugsFromDB => {
    res.render('account/dashboard', {allBugsFromDB})
  })
} else {
  res.redirect('/login')
}

  

} )





module.exports = router;