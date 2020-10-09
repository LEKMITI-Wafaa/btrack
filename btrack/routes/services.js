const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/User.model.js');
const Service = require("../models/Services.model.js");


const { body, check, validationResult } = require('express-validator');

const router = express.Router();

router.get("/", (req, res, next) => {
    if (req.session.user) {
        Service.find({})
            .then(allServicesFromDB => { res.render('account/services', { allServicesFromDB }) })
            .catch(err => next(err))
    } else { res.redirect('/login') }
})

router.post('/', [
    body('name', 'Serice name must have at least 3 chars.').isLength({ min: 3 }),
    body('email', 'Email is not valid.').isEmail(),
    check('phone')
        .isLength({ min: 10 }).withMessage('Service phone must be at least 10 digits long.')
        .isNumeric().withMessage('Service phone must contains numbers only.')
], async (req, res, next) => {
    if (req.session.user) {
        const { name, phone, email } = req.body;
        const result = validationResult(req);
        const allServicesFromDB = await Service.find({})
        console.log(allServicesFromDB)
        if (result.isEmpty()) {
            const isServiceExist = allServicesFromDB.find(s => s.name === name || s.email === email)
            if (isServiceExist) {
                res.render('account/services', { allServicesFromDB, errors: ['A service already exist with that email or name.'] });
            } else {
                Service.create({ name, phone, email })
                    .then(serviceFromDB => res.redirect('/services'))
                    .catch(err => next(err));
            }
        } else {res.render('account/services', { allServicesFromDB, errors: result.errors.map(e => e.msg) })}
    } else { res.redirect('/login') }
})


// route de suppression des services
router.get('/:id/delete', (req, res, next) => {
    if (req.session.user) {
        Service.findByIdAndDelete(req.params.id)
            .then(() => {
                res.redirect('/services')
            })
            .catch(err => next(err))
    } else { res.redirect('/login') }
})

router.get('/:id/edit', (req, res, next) => {
    Service.findByIdAndUpdate(req.params.id)
        .then(() => {
            res.redirect('/services')
        })
        .catch(err => next(err))
})




module.exports = router;