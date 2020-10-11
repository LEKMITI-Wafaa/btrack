const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/User.model.js');
const Service = require("../models/Services.model.js");


const { body, check, validationResult } = require('express-validator');

const router = express.Router();

router.get("/", (req, res, next) => {
    if (req.session.user) {
        Service.find({})
            .lean()
            .then(allServicesFromDB => {
                res.render('account/services', { allServicesFromDB, errors: req.session.errors })
                req.session.errors = undefined
            })
            .catch(err => next(err))
    } else { res.redirect('/login') }
})

router.post('/', [
    body('name', 'Serice name must have at least 3 chars.').isLength({ min: 3 }),
    body('email', 'Email is not valid.').isEmail(),
    check('phone')
        .matches(/^\d{2}\.\d{2}\.\d{2}\.\d{2}\.\d{2}$/)
        .withMessage('Invalid phone format. Use this format: xx.xx.xx.xx.xx')
], async (req, res, next) => {
    if (req.session.user) {
        const { name, phone, email } = req.body;
        const result = validationResult(req);
        if (result.isEmpty()) {
            const isServiceExist = await Service.findOne({
                $or: [
                    { name },
                    { phone },
                    { email }
                ]
            })
            console.log('post', isServiceExist)
            if (isServiceExist) {
                req.session.errors = ['A service already exist with that email, name or phone number.']
                res.redirect('/services');
            } else {
                Service.create({ name, phone, email })
                    .then(serviceFromDB => res.redirect('/services'))
                    .catch(err => next(err));
            }
        } else {
            req.session.errors = result.errors.map(e => e.msg)
            res.redirect('/services')
        }
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

router.post('/:id/edit', [
    body('name', 'Serice name must have at least 3 chars.').isLength({ min: 3 }),
    body('email', 'Email is not valid.').isEmail(),
    check('phone')
        .matches(/^\d{2}\.\d{2}\.\d{2}\.\d{2}\.\d{2}$/)
        .withMessage('Invalid phone format. Use this format: xx.xx.xx.xx.xx')
], async (req, res, next) => {
    if (req.session.user) {
        const { name, phone, email } = req.body;
        const result = validationResult(req);
        if (result.isEmpty()) {
            const isServiceExist = await Service.findOne({
                $or: [
                    { name },
                    { phone },
                    { email }
                ]
            })
            if (isServiceExist) {
                req.session.errors = ['A service already exist with that email, name or phone number.']
                res.redirect('/services');
            } else {
                Service.findByIdAndUpdate(req.params.id, { name, phone, email }, { new: true })
                    .then(() => { res.redirect('/services') })
                    .catch(err => next(err))
            }
        } else {
            req.session.errors = result.errors.map(e => e.msg)
            res.redirect('/services')
        }
    } else { res.redirect('/login') }
})



module.exports = router;