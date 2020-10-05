const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/User.model.js');
const Service = require("../models/Services.model.js");
const Bug = require('../models/Bugs.model.js')
const router = express.Router();



router.get("/", (req, res, next) => {
  if (req.session.user) {
    Service.find({})
    .then(servicesFromDB => {
      res.render("account/new-bug", {servicesFromDB})
    })
    .catch((err) => next(err))
  }else {
    res.render('auth/login')
  }    
    
      
});

router.post("/", (req, res, next) => {
    const { title, rapporter, description, solution, services, status } = req.body;
    console.log(req.body);
    Bug.create({
      title: title,
      rapporter: rapporter,
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

      res.render('account/new-bug', {
        errorMessage: err.message
      })
    } else {
        next(err) // hotline
    }
     })

})







module.exports = router;