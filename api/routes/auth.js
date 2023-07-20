const express = require('express');
const passport = require('passport');
const { User } = require('../../server/database/schemas');
const youtube = require('youtube-api');
const creds = require('../../client-secret.json');

const router = express.Router();

module.exports = router;

const oAuth = youtube.authenticate({
  type: 'oauth',
  client_id: creds.web.client_id,
  client_secret: creds.web.client_secret,
  redirect_url: creds.web.redirect_uris[0],
});

router.post('/register', async (req, res) => {
  if (!req || !req.body || !req.body.username || !req.body.password) {
    res.status(400).send({ message: 'Username and Password required' });
  }

  req.body.username_case = req.body.username;
  req.body.username = req.body.username.toLowerCase();

  const { username } = req.body;
  const newUser = User(req.body);

  try {
    const data = await User.find({ username });
    if (data[0]) {
      res.status(400).send({ message: 'Username exists' });
    }

    newUser.hashPassword().then(() => {
      newUser.save().then((savedUser, err) => {
        if (err || !savedUser) {
          res.status(400).send({ message: 'Create user failed', err });
        } else {
          res.send({
            message: 'User created successfully',
            user: savedUser.hidePassword(),
          });
        }
      });
    });
  } catch (error) {
    res.status(400).send({ message: 'Create user failed', error });
  }
});

router.post('/login', (req, res, next) => {
  req.body.username = req.body.username.toLowerCase();

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send(info);
    }

    req.login(user, err => {
      if (err) {
        res.status(401).send({ message: 'Login failed', err });
      }
      res.send({
        message: 'Logged in successfully',
        user: user.hidePassword(),
      });
    });
  })(req, res, next);
});

router.post('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      res.status(400).send({ message: 'Logout failed', err });
    }

    req.session.destroy(err => {
      if (err) {
        res.status(400).send({ message: 'Logout failed', err });
      }

      res.clearCookie('connect.sid');
      req.sessionID = null;
      res.send({ message: 'Logged out successfully' });
    });
  });
});

router.post('/someCookie', (req, res) => {
  // read cookies
  const { key, value } = req.body;

  const oAuthUrl = oAuth.generateAuthUrl({
    access_type: 'offline',
    scope:
      'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube',
  });

  console.log('-----------from /someCookies', oAuthUrl);
  res.send(oAuthUrl);
  // window.open(oAuthUrl, 'oauth window', 'width=500,height=500');

  // let options = {
  //   maxAge: 1000 * 60 * 15, // would expire after 15 minutes
  //   httpOnly: true, // The cookie only accessible by the web server
  //   // signed: true, // Indicates if the cookie should be signed
  // };

  // Set cookie
  // res.cookie('cookieFromEndpoint', 'cookieValueFromEndpoint', options); // options is optional
  // res.setHeader('Set-Cookie', ['ck=value; Expires="Session"; HttpOnly=true;']);
  // res.setHeader('Set-Cookie', [`${key}=${value}; HttpOnly; Path=/`]);
  // res.send({ message: 'Set Cookie' });
});

router.get('/oauth2callback', (req, res) => {
  console.log('-----------from /oauth2callback', req.body);
});

router.post('/connectYouTube', (req, res) => {
  const oAuthUrl = oAuth.generateAuthUrl({
    access_type: 'offline',
    scope:
      'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube',
  });

  console.log('-----------from /someCookies', oAuthUrl);
  res.send(oAuthUrl);
});
