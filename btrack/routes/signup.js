const express = require('express')
const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose')
const { body, check, validationResult } = require('express-validator');
const fileUploader = require('../configs/cloudinary.config');

const User = require('../models/User.model.js');
const Service = require("../models/Services.model.js");

const router = express.Router()

router.get("/", (req, res, next) => {
  Service.find({})
    .populate('service')
    .lean()
    .then(servicesFromDB => {
      res.render("auth/signup", { servicesFromDB ,errors: req.session.errors })
      req.session.errors = undefined
    })
    .catch((err) => next(err))
});


router.post('/',fileUploader.single('image'), [
  body('firstname', 'first name must have at least 3 chars').isLength({ min: 3 }),
  body('lastname', 'last name must have at least 3 chars').isLength({ min: 3 }),
  body('email', 'email is not valid').isEmail(),
  check('password')
    .isLength({ min: 8 }).withMessage('password must be at least 8 chars long.')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/).withMessage('Password must contain at least a number, an uppercase ans a lowercase')
], async(req, res) => {

  const { firstname, lastname, service, role, email } = req.body;
  const result = validationResult(req);
  if (req.body.password != req.body.confirmPassword) {
    req.session.errors = ['password and confirm password fields are not identical.']
    res.redirect('/signup');
  }
  if (!result.isEmpty()) {
    req.session.errors = result.errors.map(e => e.msg)
    res.redirect('/signup');
  } else {
    const isUserExist = await User.findOne({email: req.body.email})
    if(isUserExist) {
      req.session.errors = ['a user already exist with that email address.']
      res.redirect('/signup');
    } else {
      const passwordHash = bcryptjs.hashSync(req.body.password, 10); 
      const imageURL = req.file ? req.file.path : 'https://res.cloudinary.com/dshuazgaz/image/upload/v1602411437/avatar_el8zal.webp'   
      User.create({firstname, lastname, service, role, email, passwordHash, imageURL})
        .then(userFromDb => res.redirect('/login'))
        .catch(err => {
          req.session.errors = err.message
          res.redirect('/signup');
        });
    }

  }
  

})

module.exports = router;

