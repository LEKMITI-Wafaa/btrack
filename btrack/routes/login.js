const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const User = require('../models/User.model.js');




router.get('/', (req, res, next) => {
    res.render('auth/login')
})

router.post('/', (req, res, next) => {
  const { email, password } = req.body

  // Validation que email et sont pas vides
  if (!email || !password) {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return; // STOP
  }

  User.findOne({ email: email })
    .populate('service')
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'Incorrect email/password' })
        return; // STOP
      }

      // comparer le password fourni avec le password (hashé) en base
      if (bcryptjs.compareSync(password, user.passwordHash)) {
        console.log('user ok', user)
        req.session.user = user;

        res.redirect('/dashboard')
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect email/password' })
      }
    })
    .catch(err => {
      next(err)
    })

})


module.exports = router;