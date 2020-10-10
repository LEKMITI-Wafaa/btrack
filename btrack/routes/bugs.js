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
      
        const sortedSolutions = result.solutions.sort((s1, s2) => s2.date - s1.date) // sort solution by date 
        // transform the result to get well formated dates
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
          ...result, rapportedAt: {
            rapportDay: moment(result.rapportedAt).format('ll'),
            rapportTime: moment(result.rapportedAt).format('LT')
          },
          solutions
        }
        res.render('account/bug-details', { bug, user, errors: req.session.errors })
        req.session.errors = undefined;
      })

      .catch(err => next(err))
  } else {
    res.redirect('/login')
  }
})

router.post("/:id/solution",
  check('solution')
    .notEmpty().withMessage('A solution must not be empty')
    .isLength({ max: 500 }).withMessage('A solution must not exceed 500 chars long.')
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
            $push: { solutions: [{ user_id: user._id, solution, status, severity: { value: severity, updated: false }, date: Date.now() }] }
          }, { new: true })
          .then(bug => {
            res.redirect('/bugs/' + req.params.id + '/details')
          }).catch(err => next(err))
      } else {
        Bug.findById(bugId)
          .lean()
          .then(bug => {
            req.session.errors = result.errors.map(e => e.msg);
            res.redirect('/bugs/' + req.params.id + '/details')
          })
      }
    } else {
      res.redirect('/login')
    }
  })


  router.get("/create", (req, res, next) => {
    let user = req.session.user;
    console.log(user);
    if (req.session.user) {
      Service.find({})
        .lean()
        .then(servicesFromDB => {
          res.render("account/new-bug", { servicesFromDB, user, errors: req.session.errors })
          req.session.errors = undefined;
        })
        .catch((err) => next(err))
    } else {
      res.redirect('/login')
    }
  
  
  });

router.post("/create",
body('description', 'description must not exceed 500 chars long.').isLength({ max: 500 }),
body('solution', 'solution must not exceed 500 chars long.').isLength({ max: 500 }),
body('services', 'A bug is associated to one service at least.').notEmpty(),
  check('title')
    .notEmpty().withMessage('Title is mandatory.')
    .isLength({ max: 100 }).withMessage('title must not exceed 100 chars long.')
  , (req, res, next) => {
    const { title, description, solution, services, status , severity} = req.body;
    if (req.session.user) {
      const result = validationResult(req);
      if (result.isEmpty()) {
      Bug.create({
        title, description, services, status, severity, rapportedAt: Date.now(),
        rapporter: req.session.user._id,
        solutions: [{ user_id: req.session.user._id, solution, status, severity: { value: severity, updated: true } }]
      }).then(bugsFromDb => {
        res.redirect("/dashboard")
      }).catch(err => {
        console.log('💥', err);
        next(err)
      });
    } else {
      req.session.errors = result.errors.map(e => e.msg);
      res.redirect("/bugs/create", )
    }
    } else {
      req.redirect('/login')
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