const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/User.model.js');
const Service = require("../models/Services.model.js");
const Bug = require('../models/Bugs.model.js')
const router = express.Router();



router.get("/", (req, res, next) => {
  let user = req.session.user;
  if (req.session.user) {
    Service.find({})
    .then(servicesFromDB => {
      res.render("account/new-bug1", {servicesFromDB, user})
    })
    .catch((err) => next(err))
  }else {
    res.redirect('/login')
  }    
    
      
});

router.post("/", (req, res, next) => {
    const { title, description, solution, services, status } = req.body;
    console.log(req.body);
    Bug.create({
      title: title,
      rapporter: req.session.user.firstname.concat('', req.session.user.lastname),
      description: description,
      solution: solution,
      services: services,
      status: status
    }).then(bugsFromDb => {
      res.send("bug created")
    }).catch(err => {
      console.log('💥', err);
    // new mongoose.Error.ValidationError()
    if (err instanceof mongoose.Error.ValidationError || err.code === 11000) {
      // re-afficher le formulaire

      console.log('Error de validation mongoose !')

      res.render('account/new-bug1', {
        errorMessage: err.message
      })
    } else {
        next(err) // hotline
    }
     })

})







module.exports = router;

