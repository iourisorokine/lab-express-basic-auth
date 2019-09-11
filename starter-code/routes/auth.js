const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// sign up& login routes
router.get('/signup', (req, res, next) => {
  res.render('signup');
})

router.get('/login', (req, res, next) => {
  res.render('login');
})

router.post('/signup', (req, res, next) => {
  console.log(req.body);
  const {
    username,
    password
  } = req.body;
  if (!username) {
    return res.render('signup', {
      message: 'The username cannot be empty!'
    });
  }
  if (password.length < 8) {
    return res.render('signup', {
      message: 'The password shall be 8 characters minimum'
    })
  }
  User.findOne({
    username: username
  }).then(found => {
    //if not found create a new user
    if (!found) {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      User.create({
        username: username,
        password: hash
      }).then(dbUser => {
        // req.session.user = dbUser;
        console.log(dbUser);
        res.redirect('/')
      }).catch(err => {
        console.error(err)
      })
    } else if (found) {
      //if found return a message that user alreadt exists
      res.render('signup', {
        message: 'The username you entered already exists'
      })
    }
  })
})

router.post('/login', (req, res, next) => {
  const {
    username,
    password
  } = req.body;
  User.findOne({
      username
    })
    .then(found => {
      if (!found) {
        return res.render('login', {
          message: 'Invalid credentials'
        })
      }
      if (bcrypt.compareSync(password, found.password)) {
        req.session.user = found;
        console.log("login", req.session.user)
        res.redirect('/');
      } else {
        return res.render('login', {
          message: 'Invalid credentials'
        })
      }
    })
})

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    else res.redirect("/");
  });
});

module.exports = router;