const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  const user = req.session.user;
  console.log(user);
  res.render('index', {
    user
  });
});

const loginCheck = () => {
  return (req, res, next) => {
    if (req.session.user) {
      next()
    } else {
      res.redirect('/login')
    }
  };
};

router.get('/main', loginCheck(), (req, res, next) => {
  res.render('main');
})

router.get('/private', loginCheck(), (req, res, next) => {
  res.render('private');
})

module.exports = router;