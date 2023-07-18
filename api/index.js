const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const youtube = require('youtube-api');
const uuid = require('uuid').v4;
const cors = require('cors');
// const readline = require('readline');
const multer = require('multer');
const fs = require('fs');
const creds = require('../client-secret.json');

require('../server/config/environment');
require('../server/database');

const routes = require('./routes/index.js');
const configPassport = require('../server/passport/config');

const assetFolder = path.resolve(__dirname, '../dist/');
const port = process.env.PORT;
const app = express();

app.use(express.static(assetFolder));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://youtune-uploader-collyerdesign-gmailcom.vercel.app',
    'https://youtune-uploader.vercel.app',
  ],
};
app.use(cors(corsOptions));

const whitelist = ['*'];

app.use((req, res, next) => {
  const origin = req.get('referer');
  const isWhitelisted = whitelist.find(w => origin && origin.includes(w));
  if (isWhitelisted) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-Requested-With,Content-Type,Authorization',
    );
    res.setHeader('Access-Control-Allow-Credentials', true);
  }
  // Pass to next layer of middleware
  if (req.method === 'OPTIONS') res.sendStatus(200);
  else next();
});

const setContext = (req, res, next) => {
  if (!req.context) req.context = {};
  next();
};
app.use(setContext);

const storage = multer.diskStorage({
  destination: './',
  filename(req, file, cb) {
    console.log('------storage------>', file);
    const newFilename = `${uuid()}-${file.originalname}`;
    cb(null, newFilename);
  },
});

const uploadVideoFile = multer({
  storage,
}).array('file');

const oAuth = youtube.authenticate({
  type: 'oauth',
  client_id: creds.web.client_id,
  client_secret: creds.web.client_secret,
  redirect_url: creds.web.redirect_uris[0],
});

app.post('/connectYT', (req, res) => {
  res.send(
    oAuth.generateAuthUrl({
      access_type: 'offline',
      scope:
        'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube',
    }),
  );
});

app.post('/getUnlisted', (req, res) => {
  console.log('--------------getunlisted------------->', req.body);
  const { playlistId } = req.body;
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

app.post('/uploadVideo', uploadVideoFile, (req, res) => {
  if (req.files) {
    const {
      title,
      description,
      scheduleDate,
      categoryId,
      tags,
      playlistToken,
      userToken,
    } = req.body;
    const filename = req.files;
    const videoQue = Object.keys(filename).length;

    if (playlistToken !== 'undefined' && userToken !== 'undefined') {
      const jsonTokens = JSON.parse(userToken.split('j:')[1]);
      oAuth.setCredentials(jsonTokens);
      return sendToYT(
        videoQue,
        req.files,
        title,
        description,
        scheduleDate,
        categoryId,
        tags,
      );
    }
    res.setHeader('Set-Cookie', ['upload=video; Expires=Wed, 19 Jul 2023 12:55:17 GMT; HttpOnly; SameSite=None; Secure']);
    return res.send(
      oAuth.generateAuthUrl({
        access_type: 'offline',
        scope:
          'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload',
        state: JSON.stringify({
          filename: req.files,
          title,
          description,
          scheduleDate,
          categoryId,
          tags,
          videoQue,
        }),
      }),
    );
  }
});

const sendToYT = (
  videoQue,
  files,
  title,
  description,
  scheduleDate,
  categoryId,
  tags,
) => {
  let index = -1;
  if (videoQue === 0) {
    process.exit();
  } else {
    index++;
    videoQue--;
    console.log('---------sendToYT--->', {
      videoQue,
      files,
      index,
      description: Array.isArray(description)
        ? description[index]
        : description,
      title: Array.isArray(title) ? title[index] : title,
      scheduleDate: Array.isArray(scheduleDate)
        ? new Date(scheduleDate[index])?.toISOString()
        : new Date(scheduleDate)?.toISOString(),
      categoryId: Array.isArray(categoryId) ? categoryId[index] : categoryId,
      tags: Array.isArray(tags) ? tags[index] : tags,
    });

    // youtube.videos.insert(
    //   {
    //     part: 'id,snippet,status',
    //     notifySubscribers: false,
    //     requestBody: {
    //       snippet: {
    //         title: Array.isArray(title) ? title[index] : title,
    //         description: Array.isArray(description)
    //           ? description[index]
    //           : description,
    //         categoryId: Array.isArray(categoryId)
    //           ? categoryId[index]
    //           : categoryId,
    //         tags: Array.isArray(tags) ? tags[index] : tags,
    //       },
    //       status: {
    //         privacyStatus: 'private',
    //         // publishAt: Array.isArray(scheduleDate)
    //         //   ? new Date(scheduleDate[index]).toISOString()
    //         //   : new Date(scheduleDate).toISOString(),
    //       },
    //     },
    //     media: {
    //       body: fs.createReadStream(files[index].filename),
    //     },
    //   },
    //   // {
    //   //   // Use the `onUploadProgress` event from Axios to track the
    //   //   // number of bytes uploaded to this point.
    //   //   onUploadProgress: evt => {
    //   //     const progress = (evt.bytesRead / fileSize) * 100;
    //   //     readline.clearLine(process.stdout, 0);
    //   //     readline.cursorTo(process.stdout, 0, null);
    //   //     process.stdout.write(`${Math.round(progress)}% complete`);
    //   //   },
    //   // },
    //   (err, data) => {
    //     console.log(err, data);
    //     console.log('Done');
    //     sendToYT(
    //       videoQue,
    //       files,
    //       title,
    //       description,
    //       scheduleDate,
    //       categoryId,
    //       tags,
    //     );
    //   },
    // );
  }
};
console.log('-------server-->', process.env.NODE_ENV === 'development')
app.get('/oauth2callback', (req, res) => {
  oAuth.getToken(req.query.code, (err, tokens) => {
    if (err) {
      console.log('err');
      return;
    }

    console.log('-------tokens------>', tokens);
    oAuth.setCredentials(tokens);
    return (userPlaylistId = youtube.channels
      .list({
        part: ['contentDetails'],
        mine: true,
      })
      .then(
        response => {
          const playlistId =
            response.data.items[0].contentDetails.relatedPlaylists.uploads;

          res.setHeader('Set-Cookie', ['ck=value; Expires=Wed, 19 Jul 2023 12:55:17 GMT; HttpOnly; SameSite=None; Secure']);
          res.cookie('cookiename', 'cookievalue', { maxAge: 900000, httpOnly: true });
          res.cookie('userPlaylistId', playlistId, {
            maxAge: 900000,
            secure: true,
            httpOnly: true,
            sameSite: 'none',
            domain: process.env.NODE_ENV === 'development' ? '.localhost' : 'youtune-uploader.vercel.app',
          });
          res.cookie('tokens', tokens, {
            maxAge: 900000,
            secure: true,
            httpOnly: true,
            sameSite: 'none',
            domain: process.env.NODE_ENV === 'development' ? '.localhost' : 'youtune-uploader.vercel.app',
          });
          // hack to close the window
          res.send('<script>window.close();</script > ');

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

app.post('/getPlaylistId', (req, res) => {
  const { tokens } = req.body;
  const jsonTokens = JSON.parse(tokens.split('j:')[1]);
  oAuth.setCredentials(jsonTokens);
  return (userPlaylistId = youtube.channels
    .list({
      part: ['contentDetails'],
      mine: true,
    })
    .then(
      response => {
        // return the uploads playlist id
        const playlistId =
          response.data.items[0].contentDetails.relatedPlaylists.uploads;
        // const playlistId = 33333;
        res.cookie('userPlaylistId', playlistId, {
          maxAge: 900000,
          httpOnly: false,
        });
        res.send(playlistId);
      },
      err => {
        console.error('Execute error', err);
      },
    ));
});

app.post('/updateVideo', (req, res) => {
  const { videoId, title } = req.body;
  // const jsonTokens = JSON.parse(userTokens.split('j:')[1]);
  // oAuth.setCredentials(jsonTokens);
  console.log('--------/updateVideo--->', videoId, title);
  return youtube.videos
    .update({
      part: 'id,snippet,status',
      requestBody: {
        id: videoId,
        snippet: {
          title,
          categoryId: 22,
        },
      },
    })
    .then(
      response => {
        console.log('updateVideo response.data -->', response.data);
        res.send(response.data);
      },
      err => {
        console.error('Execute error', err);
      },
    );
});

configPassport(app, express);

app.use('/', routes);

app.listen(port, () => console.log(`Server is listening on port ${port}`));
