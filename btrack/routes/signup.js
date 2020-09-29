const express = require('express')
const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose')

const User = require('../models/User.model.js')

const router = express.Router()

router.get("/", (req, res, next)=> {
  res.render("auth/signup")
})

const salt = bcryptjs.genSaltSync(10)

router.post('/signup', (req,res, next) => {
  console.log('valeurs', req.body)
  // enregistrer notre user en base

  const {username, email, password} = req.body

  //
  // Validation server manuelle
  //

  // vérifier que req.body.username non-vide
  // if (!username || !email || !password) {
  //   res.render('auth/signup', {
  //     errorMessage: 'Merci de remplir tous les champs'
  //   })
  //   return; // STOP
  // }

  //
  //
  //

  const plainPassword = req.body.password;

  const hashed = bcryptjs.hashSync(plainPassword, salt)
  console.log('hashed=', hashed)

  User.create({
    username: req.body.username,
    email: req.body.email,
    passwordHash: hashed
  }).then(userFromDb => {
    // res.redirect('/profile')
    res.send('user créé!')
  }).catch(err => {
    console.log('💥', err);

    // new mongoose.Error.ValidationError()

    if (err instanceof mongoose.Error.ValidationError || err.code === 11000) {
      // re-afficher le formulaire

      console.log('Error de validation mongoose !')

      res.render('auth/signup', {
        errorMessage: err.message
      })
    } else {
      next(err) // hotline
    }

    
  })

})


