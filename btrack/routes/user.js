const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const User = require('../models/User.model.js');
const Service = require('../models/Services.model.js');
const { body, check, validationResult } = require('express-validator');
const router = require('./login');
const fileUploader = require('../configs/cloudinary.config');
const routeGuard = require('../configs/route-guard.config');

router.get('/:id/edit', routeGuard, (req, res, next) => {
  let user = req.session.user;
  Service.find({})
    .lean()
    .then((servicesFromDB) => {
      const services = servicesFromDB.map(service => {
        return { ...service, selected: service._id == user.service._id }
      })
      const roles = ['manager', 'employee', 'validator'].map(role => {
        return { role, selected: role === user.role }
      })
      res.render('account/edit-user', { services, user, roles, errors: req.session.errors })
      req.session.errors = undefined
    })
    .catch(err => next(err))
})


router.post('/:id/edit', routeGuard, fileUploader.single('image'), [
  check('firstname').isLength({ min: 3 }).withMessage('Firstname must have at least 3 chars'),
  check('lastname').isLength({ min: 3 }).withMessage('Lastname must have at least 3 chars')
], (req, res, next) => {
  const result = validationResult(req);
  let user = req.session.user;
  if (!result.isEmpty()) {
    req.session.errors = result.errors.map(e => e.msg)
  } else {
    const { firstname, lastname, service, role } = req.body;
    User
      .findByIdAndUpdate(req.params.id, { firstname, lastname, service, role, imageURL: req.file ? req.file.path : user.imageURL }, { new: true })
      .populate('service')
      .then(newUser => {
        req.session.user = newUser
        res.redirect('/user/' + req.params.id + '/edit')
      })
      .catch(err => next(err));
  }
})

router.post('/:id/edit-password', routeGuard, [
  check('password')
    .isLength({ min: 8 }).withMessage('password must be at least 8 chars long.')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/).withMessage('Password must contain at least a number, an uppercase and a lowercase')
], (req, res, next) => {

  const result = validationResult(req);

  let user = req.session.user;

  if (req.body.password != req.body.confirmPassword) {
    req.session.errors = ['password and confirm password fields are not identical.']
    res.redirect('/user/' + req.params.id + '/edit')
  }
  if (!result.isEmpty()) {
    req.session.errors = result.errors.map(e => e.msg)
    res.redirect('/user/' + req.params.id + '/edit')
  } else {
    const passwordHash = bcryptjs.hashSync(req.body.password, 10);
    User.findByIdAndUpdate(req.params.id, { passwordHash }, { upsert: true })
      .then(userFromDb => res.redirect('/dashboard'), { user })
      .catch(err => {
        req.session.errors = err.message
        res.redirect('/user/' + req.params.id + '/edit')
      });
  }
})

router.get('/logout', (req, res) => {

  req.session.destroy();
  res.redirect('/login');
});





module.exports = router;