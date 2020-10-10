const express = require('express')
const mongoose = require('mongoose')
const Bug= require('../models/Bugs.model.js');
const User = require('../models/User.model.js');
const Service = require("../models/Services.model.js");
const router = express.Router();

// route vers la formulaire de de mise à jours du bug:
router.get('/:id/editBug', (req, res, next) =>{
  let user = req.session.user;
  if (req.session.user) {
    Service.find({})
      .lean()
      .then(servicesFromDB => {
        Bug.findById(req.params.id)
            .lean()
            .populate('rapporter')
            .populate('solutions.user_id')
            .then(bug =>res.render('account/editBug', {bug, servicesFromDB, user}))
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
    const {status, services, solution} = req.body;
    Bug.findByIdAndUpdate(req.params.id, 
      {services, status,
        $push:{solutions: [{ user_id: req.session.user._id, solution }]}
    }, {new: true})
    .lean()
    .populate('services')
    .populate('rapporter')
    .populate('solutions.user_id')
    .then(bug => {res.render('account/bug-details', {bug, user})
    }).catch(err => next(err))
  }else {
    res.redirect('/login')
  } 
})

// route d'affichage de detail bug
// router.get('/:bugid', (req, res, next) =>{
//   console.log('coucou')
//   let user = req.session.user;
//   if (req.session.user) {   
//     const id = req.params.bugid;
//       Bug.findOne({_id: id})
//       .populate('services')
//       .populate('rapporter')
//       .populate('solutions.user_id')
//       .lean()
//       .then((bug) =>{
//         console.log(bug) 
//         res.render('account/bug-details', {bug, user})
//       })
      
//       .catch(err => next(err))
//   }else {
//     res.redirect('/login')
//   } 
// })
router.get('/:bugid', (req, res, next) =>{
  let user = req.session.user;
    if (req.session.user) {   
      const id = req.params.bugid;
        Bug.findOne({_id: id})
        .populate('services')
        .populate('rapporter')
        .populate('solutions.user_id')
        .lean()
        .then((bug) =>{
          console.log(bug) 
          res.render('account/bug-details', {bug, user})
        })
      .catch(err => next(err))
    }else {
        res.redirect('/login')
    }   
  })







module.exports = router;