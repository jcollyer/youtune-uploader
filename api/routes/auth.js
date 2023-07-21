const express = require('express');
const passport = require('passport');
const { User } = require('../../server/database/schemas');
const youtube = require('youtube-api');
const creds = require('../../client-secret.json');

const router = express.Router();

module.exports = router;

const isDev = process.env.NODE_ENV === 'development';

const oAuth = youtube.authenticate({
  type: 'oauth',
  client_id: creds.web.client_id,
  client_secret: creds.web.client_secret,
  redirect_url: isDev ? creds.web.redirect_uris[1] : creds.web.redirect_uris[2],
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

  res.setHeader('Set-Cookie', [
    `ck=value; HttpOnly; Domain=${
      process.env.NODE_ENV === 'development'
        ? 'localhost'
        : 'youtune-uploader.vercel.app'
    }; Path=/`,
  ]);
  // res.setHeader('Set-Cookie', [`${key}=${value}; HttpOnly; Path=/`]);
  res.send({ message: 'Set Cookie' });
});

router.post('/connectYouTube', (req, res) => {
  const oAuthUrl = oAuth.generateAuthUrl({
    access_type: 'offline',
    scope:
      'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube',
  });

  console.log('-----------from /connectYouTube', oAuthUrl);
  res.send(oAuthUrl);
});

router.get('/oauth2callback', (req, res) => {
  oAuth.getToken(req.query.code, (err, tokens) => {
    if (err) {
      console.log('err');
      return;
    }

    console.log('-------tokens------>', tokens.refresh_token);
    oAuth.setCredentials(tokens);
    res.cookie('tokens', tokens, {
      maxAge: 900000,
      domain:
        process.env.NODE_ENV === 'development'
          ? 'localhost'
          : 'youtune-uploader.vercel.app',
    });
    return (userPlaylistId = youtube.channels
      .list({
        part: ['contentDetails'],
        mine: true,
      })
      .then(
        response => {
          const playlistId =
            response.data.items[0].contentDetails.relatedPlaylists.uploads;

          res.cookie('userPlaylistId', playlistId, {
            maxAge: 900000,
            domain:
              process.env.NODE_ENV === 'development'
                ? 'localhost'
                : 'youtune-uploader.vercel.app',
          });
          // hack to close the window
          res.send('<script>window.close();</script>');

          if (req.query.state) {
            const {
              filename,
              title,
              description,
              videoQue,
              scheduleDate,
              categoryId,
              tags,
            } = JSON.parse(req.query.state);
            return sendToYT(
              videoQue,
              filename,
              title,
              description,
              scheduleDate,
              categoryId,
              tags,
            );
          }
        },
        err => {
          console.error('Execute error', err);
        },
      ));
  });
});

router.post('/getUnlisted', (req, res) => {
  const { playlistId } = req.body;
  const { cookie } = req.headers;
  const jsTokenCookie = cookie.split('; ').find(token => {
    return token.startsWith('tokens=');
  });
  const jsonTokens = JSON.parse(
    decodeURIComponent(jsTokenCookie.split('tokens=j%3A')[1]),
  );
  console.log('-------------------/getUnlisted-->', jsonTokens);
  oAuth.setCredentials(jsonTokens);

  youtube.playlistItems
    .list({
      part: ['status, id, contentDetails'],
      playlistId: playlistId,
    })
    .then(
      response => {
        const playlistItems = response.data.items;
        const videoIds = playlistItems.map(
          pItem => pItem.contentDetails.videoId,
        );
        youtube.videos
          .list({
            part: ['status', 'snippet'],
            id: videoIds,
          })
          .then(
            response => {
              const videos = response.data.items;
              const unlistedVideos = videos.filter(
                video => video.status.privacyStatus === 'private',
              );

              const scheduledVideos = unlistedVideos.filter(video => {
                console.log('------date', video.status.publishAt);
                return new Date(video.status.publishAt) >= new Date();
              });

              res.send(scheduledVideos);
            },
            err => {
              console.error('Execute error', err);
            },
          );
      },
      err => {
        console.error('Execute error', err);
      },
    );
});
