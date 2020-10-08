const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { route } = require('./login');
const Bug = require('../models/Bugs.model.js'); 
const User = require('../models/User.model.js');
const Service= require('../models/Services.model.js');

// router.get('/:bugid', (req, res, next) =>{
//   const id = req.params.bugid;
//     Bug.findOne({_id: id})
//     .populate('services')
//     .populate('rapporter')
//     .populate('user_id')
//     .then((bug) => {
//         res.render('account/bug-details', {
//             bug
//         })
//     })
//     .catch(err => next(err))

// })

// route vers la formulaire de de mise à jours du bug:
router.get('/:id/editBug', (req, res, next) =>{
  let user = req.session.user;
  if (req.session.user) {
    Service.find({})
      .then(servicesFromDB => {
        Bug.findById(req.params.id)
            .populate('rapporter')
            .populate('solutions.user_id')
            .then(toEdit =>res.render('account/editBug', {toEdit, servicesFromDB, user}))
            .catch(err => next(err))
      })
      .catch(err => next(err))
    }else {
      res.redirect('/login')
    }        
})
// route de traitement du formulaire de bug: ajout d'instance
router.post("/:id", (req, res, next) => {
  let user = req.session.user;
  if (req.session.user) {  
    const {status, services} = req.body;
    let solution={user_id: req.body.user_id, solution:req.body.solution};
    Bug.findByIdAndUpdate(req.params.id, 
      {$push:{solutions:solution},
      services: services,
      status: status
    }, {new: true})
    .populate('services')
    .populate('rapporter')
    .populate('solutions.user_id')
    .then(bug => {res.render('account/bug-details', {bug, user})
    }).catch(err => {
      console.log('💥', err);
    // new mongoose.Error.ValidationError()
    if (err instanceof mongoose.Error.ValidationError || err.code === 11000) {
      // re-afficher le formulaire
      console.log('Error de validation mongoose !')
      res.render('account/editBug', {
        errorMessage: err.message
      })
    } else {
        next(err) // hotline
    }
    })
  }else {
    res.redirect('/login')
  } 
})

// route d'affichage de detail bug
router.get('/:bugid', (req, res, next) =>{
  let user = req.session.user;
  if (req.session.user) {   
    const id = req.params.bugid;
      Bug.findOne({_id: id})
      .populate('services')
      .populate('rapporter')
      .populate('solutions.user_id')
      .then((bug) => res.render('account/bug-details', {bug, user}))
      .catch(err => next(err))
  }else {
    res.redirect('/login')
  } 
})

// route d'affichege de la dashboard:
router.get('/', (req, res, next) =>{
if (req.session.user) { 
  Bug.find({})
  .populate('rapporter')
  .then(allBugsFromDB => {
    res.render('account/dashboard', {allBugsFromDB})
  })
} else {res.redirect('/login')}
})


router.post('/:id/delete', (req, res, next) => {
  Bug.findByIdAndDelete(req.params.id)
  .then(() => {
      res.redirect('/dashboard')
  })
  .catch(err => next(err))
})
module.exports = router;