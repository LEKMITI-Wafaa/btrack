const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const User = require('../models/User.model.js');
const Service= require('../models/Services.model.js');
const { body,check, validationResult } = require('express-validator');
const router = require('./login');


router.post('/:id/edit', [
  check('firstname').isLength({ min: 3 }).withMessage('Firstname must have at least 3 chars'),
  check('lastname').isLength({ min: 3 }).withMessage('Lastname must have at least 3 chars')
], (req, res, next)=>{
  const result = validationResult(req);
  let errors = [];
  if (req.session.user) {
    let user = req.session.user;
    if (!result.isEmpty() || errors.length > 0) {
      console.log(result)
      res.render('account/edit-user', {errors: errors.concat(result.errors.map(e => e.msg))
      })
    } else {
        const {firstname, lastname, service, role} = req.body;
        console.log('coucou',req.params.id)
        User.findByIdAndUpdate(req.params.id, {firstname, lastname, service, role})
          .then(userFromDb => res.render('account/dashboard'),{user})
          .catch(err => next(err));
      }
  }else {
      res.redirect('/login')
  }
})

router.post('/:id/edit-password',[
  check('password')
    .isLength({ min: 8 }).withMessage('password must be at least 8 chars long.')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/).withMessage('Password must contain at least a number, an uppercase and a lowercase')
], (req, res, next) =>{
  const result = validationResult(req);
  let errors = [];
  if (req.session.user) {
    let user = req.session.user;

    if (req.body.password != req.body.confirmPassword) {
      errors.push('password and confirm password fields are not identical.')
    }
    if (!result.isEmpty() || errors.length > 0) {
      res.render('account/edit-user', {
        errors: errors.concat(result.errors.map(e => e.msg))
      })
    } else {
      const passwordHash = bcryptjs.hashSync(req.body.password, 10);    
      User.findByIdAndUpdate(req.params.id, {passwordHash},{upsert: true})
        .then(userFromDb => res.redirect('/dashboard'),{user})
        .catch(err => {
          errors.push(err.message)
          res.render('account/edit-user', {errors});
        });
    }
    }else {
    res.redirect('/login')
}
})

router.get('/:id', (req, res, next) =>{
  let user = req.session.user;
    if (req.session.user) {
      Service.find({})
      .lean()
      .then((servicesFromDB) =>{
        servicesFromDB.forEach((serv, i)=> {
          if(user.service.includes(serv._id)){
              serv.selected = true
          }
      })
      res.render('account/edit-user', {servicesFromDB, user})
      })
      .catch(err => next(err))
    }else {
      res.redirect('/login')
  }   
})

module.exports = router;