const express = require('express')
const mongoose = require('mongoose')
const moment = require('moment')
const Bug = require('../models/Bugs.model.js');
const User = require('../models/User.model.js');
const Service = require("../models/Services.model.js");
const router = express.Router();
const { body, check, validationResult } = require('express-validator');





// details du bug
router.get('/:id/details', (req, res, next) => {
  let user = req.session.user;
  if (req.session.user) {
    Bug.findById(req.params.id)
      .populate('rapporter')
      .populate('solutions.user_id')
      .populate('services')
      .lean()
      .then(result => {
        console.log('result',result)
        const sortedSolutions = result.solutions.sort((s1, s2) => s2.date - s1.date) 
        console.log('res',res)
        const solutions = sortedSolutions.map(s => {
          const solution = {
            ...s, date: {
              rapportDay: moment(s.date).format('ll'),
              rapportTime: moment(s.date).format('LT'),
            }
          }
          return solution
        })
        const bug = {
          ...result, date: {
            rapportDay: moment(result.rapportedAt).format('ll'),
            rapportTime: moment(result.rapportedAt).format('LT')
          },
          solutions
        }
        console.log('bug', bug)
        res.render('account/bug-details', { bug, user })
      })

      .catch(err => next(err))
  } else {
    res.redirect('/login')
  }
})

router.post("/:id/solution",
  check('solution')
    .notEmpty().withMessage('A solution must not be empty')
    .isLength({ max: 3000 }).withMessage('A solution must exceed 3000 chars long.')
  , (req, res, next) => {
    const user = req.session.user;
    const bugId = req.params.id;
    if (user) {
      const result = validationResult(req);
      if (result.isEmpty()) {
        const { status, severity, solution } = req.body;
        Bug.findByIdAndUpdate(bugId,
          {
            status, severity,
            $push: { solutions: [{ user_id: user._id, solution, status, severity: {value: severity, updated: true}, date: Date.now() }] }
          }, { new: true })
          .then(bug => {
            res.redirect('/bugs/' + req.params.id + '/details')
          }).catch(err => next(err))
      } else {
        Bug.findById(bugId)
          .lean()
          .then(bug => {
            res.render('account/bug-details', { bug, user, errors: esult.errors.map(e => e.msg) })
          })
      }
    } else {
      res.redirect('/login')
    }
  })




// router.get('/:id', (req, res, next) => {
//   let bugId = req.params.id;
//   if (req.session.user) {
//     Bug.findOne({ _id: bugId })
//       .lean()
//       .populate('services')
//       .populate('rapporter')
//       .populate('user_id')
//       .then((bug) => {
//         console.log(bug)
//         res.render('account/bug-details', {bug })
//       })
//       .catch(err => next(err))
//   } else {
//     res.redirect('/login')
//   }
// })







module.exports = router;