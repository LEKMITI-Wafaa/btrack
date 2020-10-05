const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { route } = require('./login');
const Bug = require('../models/Bugs.model.js'); 
const User = require('../models/User.model.js');



router.get('/', (req, res, next) =>{
if (req.session.user) { 
  Bug.find({})
  .populate('rapporter')
  .then(allBugsFromDB => {
    res.render('account/dashboard1', {allBugsFromDB})
  })
} else {
  res.render('auth/login')
}

  

} )





module.exports = router;