const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcryptjs= require('bcryptjs');




router.get('/', (req, res, next) => {
    res.render('auth/login')
})



module.export = router;