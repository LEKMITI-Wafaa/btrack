const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/User.model.js');
const Service = require("../models/Services.model.js");
const router = express.Router();



router.get("/", (req, res, next) => {
    res.render('account/services')
      
});






module.exports = router;