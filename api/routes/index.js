const express = require('express');
const path = require('path');

const auth         = require('./auth');
const user         = require('./user');
const users        = require('./users');

const router = express.Router();


function checkTrailingSlash(req, res, next) {
  const trailingSlashUrl = req.baseUrl + req.url;
  if (req.originalUrl !== trailingSlashUrl) {
    res.redirect(301, trailingSlashUrl);
  } else {
    next();
  }
}



router.use('/api/auth', auth);
router.use('/api/user', user);
router.use('/api/users', users);

router.use(checkTrailingSlash);

router.get('/api/tags', (req, res) => {
  res.send([
    'MERN', 'Node', 'Express', 'Webpack', 'React', 'Redux', 'Mongoose',
    'Bulma', 'Fontawesome', 'Ramda', 'ESLint', 'Jest',
  ]);
});

router.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../dist', 'index.html'));
});

module.exports = router;
