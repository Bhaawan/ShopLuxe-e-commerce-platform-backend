const express = require('express');
const { createUser, loginUser, checkAuth } = require('../controller/Auth');
const passport = require('passport');

const router = express.Router();
//  /auth is already added in base path
router
.post('/signup', createUser)
.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (!user) {
      // Handle authentication failure and send back a JSON error response
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Login failed' });
      }
      return res.json(user);
    });
  })(req, res, next);
})
.get('/check',passport.authenticate('jwt'), checkAuth);

exports.router = router;