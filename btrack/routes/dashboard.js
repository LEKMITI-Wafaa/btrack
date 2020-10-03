const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { route } = require('./login');

router.get('/', (req, res, next) =>{
  res.render('account/dashboard')
} )





module.exports = router;