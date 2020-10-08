const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/User.model.js');
const Service = require("../models/Services.model.js");
const router = express.Router();

router.get("/", (req, res, next) =>{
    if (req.session.user) {
        Service.find({})
        .then(allServicesFromDB =>{res.render('account/services',{allServicesFromDB})})
        .catch(err => next(err))
    }else {res.redirect('/login')}   
})



router.post("/", (req, res, next) => {
    if (req.session.user) {
        const {name, phone, email} = req.body;
        Service.create({name, phone, email})
        .then(servicesFromDB =>{res.redirect('/services')})
        .catch(err => next(err))
    }else {res.redirect('/login')}              
});


// route de supprission des services
router.get('/:id/delete', (req, res, next) => {
    Service.findByIdAndDelete(req.params.id)
    .then(() => {
        res.redirect('/services')
    })
    .catch(err => next(err))
})




module.exports = router;