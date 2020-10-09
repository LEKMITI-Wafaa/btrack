const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/User.model.js');
const Service = require("../models/Services.model.js");
const Bug = require('../models/Bugs.model.js')
const router = express.Router();



router.get("/", (req, res, next) => {
  let user = req.session.user;
  console.log(user);
  if (req.session.user) {
    Service.find({})
      .lean()
      .then(servicesFromDB => {
        res.render("account/new-bug", { servicesFromDB, user })
      })
      .catch((err) => next(err))
  } else {
    res.redirect('/login')
  }


});

router.post("/", (req, res, next) => {
  const { title, description, solution, services, status } = req.body;
  if (req.session.user) {
    Bug.create({
      title, description, services, status,
      rapporter: req.session.user._id,
      solutions: [{ user_id: req.session.user._id, solution }]
    }).then(bugsFromDb => {
      res.redirect("/dashboard")
    }).catch(err => {
      console.log('💥', err);
      next(err)
    })
  } else {
    req.redirect('/login')
  }
})







module.exports = router;

