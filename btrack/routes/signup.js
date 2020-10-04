const express = require('express')
const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose')
const { body, check, validationResult } = require('express-validator');


const User = require('../models/User.model.js');
const Service = require("../models/Services.model.js");

const router = express.Router()

router.get("/", (req, res, next) => {
  Service.find({})
    .then(servicesFromDB => {
      const data = { servicesFromDB }
      res.render("auth/signup", data)
    })
    .catch((err) => next(err))
});


router.post('/', [
  body('firstname', 'first name must have at least 3 chars').isLength({ min: 3 }),
  body('lastname', 'last name must have at least 3 chars').isLength({ min: 3 }),
  body('email', 'email is not valid').isEmail(),
  check('password')
    .isLength({ min: 8 }).withMessage('password must be at least 8 chars long.')
    .matches("(?=.*\d*)").withMessage('password must contain at least a number.')
    .matches("(?=.*[a-z]*)").withMessage('password must contain at least a lowercase char.')
    .matches("(?=.*[A-Z]*)").withMessage('password must contain at least an uppercase char.')
], async(req, res, next) => {

  const { firstname, lastname, service, role, email } = req.body;

  let errors = [];
  const result = validationResult(req);
  if (req.body.password != req.body.confirmPassword) {
    errors.push('password and confirm password fields are not identical.')
  }
  if (!result.isEmpty() || errors.length > 0) {
    res.render('auth/signup', {
      errors: errors.concat(result.errors.map(e => e.msg))
    })
  } else {
    const isUserExist = await User.findOne({email: req.body.email})
    if(isUserExist) {
      errors.push('a user already exist with that email address.')
      res.render('auth/signup', {errors});
    } else {
      const passwordHash = bcryptjs.hashSync(req.body.password, 10);    
      User.create({firstname, lastname, service, role, email, passwordHash})
        .then(userFromDb => res.redirect('/login'))
        .catch(err => {
          errors.push(err.message)
          res.render('auth/signup', {errors});
        });
    }

  }
  

})

module.exports = router;

