const express = require('express')
const router = express.Router();
const routeGuard = require('../configs/route-guard.config');
const mongoose = require('mongoose')
const Bug = require('../models/Bugs.model.js');






router.get('/', routeGuard, (req, res) => {
  return res.render('account/repport', {user: req.session.user} );
});
router.get('/bug-stat', (req, res) => {

  Bug.find({})
    .lean()
    .then(result => {
      console.log('result', result)
      const bugs = {
        bugTypes: ['Confirmed', 'In Progress', 'Resolved'],
        countByType: [
          result.reduce((sum, current) => current.status === 'Confirmed' ? sum +1 : sum, 0),
          result.reduce((sum, current) => current.status === 'In Progress' ? sum +1 : sum, 0),
          result.reduce((sum, current) => current.status === 'Resolved' ? sum +1 : sum, 0)
        ]
      }
      console.log('bugs', bugs)
      return res.send(Object.values(bugs));
    })
});



module.exports = router;