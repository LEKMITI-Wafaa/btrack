const express = require('express')
const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose')

const User = require('../models/User.model.js');
const Service = require("../models/Services.model.js");

const router = express.Router()

router.get("/", (req, res, next) => {
  Service.find({})
    .then(servicesFromDB => {
      const data = {servicesFromDB}
      res.render("auth/signup1", data)
    })
    .catch((err) => next(err))
});

const salt = bcryptjs.genSaltSync(10)
console.log('sel:', salt);



router.post('/', (req, res, next) => {
  const plainPassword = req.body.password;
  const hashed = bcryptjs.hashSync(plainPassword, salt)
  // console.log('valeurs', req.body)
  // enregistrer notre user en base
  const $pwd = req.body.password;
  const $pwdConfirm = req.body.password2;
  if($pwd != $pwdConfirm) {
    res.render('auth/signup1', {
      errorMessage: "Confirmation password does not match!"
    })
    return;
  }else  {
    const { firstname, lastname, service, role, email, passwordHash } = req.body;
    User.create({
      firstname: firstname,
      lastname: lastname,
      service: service,
      role: role,
      email: email,
      passwordHash: hashed
    }).then(userFromDb => {
      res.redirect('/login')
    }).catch(err => {
      console.log('💥', err);
    // new mongoose.Error.ValidationError()
    if (err instanceof mongoose.Error.ValidationError || err.code === 11000) {
      // re-afficher le formulaire

      console.log('Error de validation mongoose !')

      res.render('auth/signup1', {
        errorMessage: err.message
      })
    } else {
      next(err) // hotline
    }
   })
  }
})


module.exports = router;

