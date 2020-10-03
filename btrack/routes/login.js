const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcryptjs= require('bcryptjs');




router.get('/', (req, res, next) => {
    const data = {
        layout: false
      }
    res.render('auth/login', data)
})



module.exports = router;