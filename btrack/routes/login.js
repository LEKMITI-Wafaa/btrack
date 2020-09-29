const express = require('express');
const bcryptjs= require('bcryptjs');

const User= require('../models/User.model.js');

const router = express.Router();

router.get('/login', (req, res, next) => {
    res.render('auth/login', {})
})

const salt = bcryptjs.genSaltSync(10);

router.post('login', (req, res, next) =>{
    const plainPassword = req.body.password;

    const hashed = bcryptjs.hashSync(plainPassword, salt);
          
})