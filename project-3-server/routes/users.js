var express = require('express');
var router = express.Router();

const isAuthenticated = require('../middleware/isAuthenticated')

const User = require('../models/User.model')

/* GET users listing. */
router.get('/profile/:userId', (req, res, next) => {
  User.findById(req.params.userId)
    .populate('posts')
    .then((foundUser) => {
      res.json(foundUser)
    })
    .catch((err) => {
      console.log(err)
    })
});

router.post('/edit-profile/:userId', isAuthenticated, (req, res, next) => {
  User.findByIdAndUpdate(req.params.userId, {
    profile_image: req.body.profile_image,
    username: req.body.username,
    password: req.body.password,
    location: req.body.location,
    occupation: req.body.occupation
}, {
    new: true
})

    .then((updatedUser) => {
      console.log(updatedUser)
      res.json(updatedUser);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: 'An error occurred while updating the user.',
        error: err
      });
    });
});


module.exports = router;
