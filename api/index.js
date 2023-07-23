const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

require('../server/config/environment');
require('../server/database');

const routes = require('./routes/index.js');
const configPassport = require('../server/passport/config');
const youtube = require('youtube-api');
const creds = require('../client-secret.json');
const {sendToYT, uploadVideoFile} = require('./utils/youtube');


const assetFolder = path.resolve(__dirname, '../dist/');
const port = process.env.PORT;
const app = express();

const isDev = process.env.NODE_ENV === 'development';


const oAuth = youtube.authenticate({
  type: 'oauth',
  client_id: creds.web.client_id,
  client_secret: creds.web.client_secret,
  redirect_url: isDev ? creds.web.redirect_uris[0] : creds.web.redirect_uris[2],
});

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://youtune-uploader-collyerdesign-gmailcom.vercel.app',
    'https://youtune-uploader.vercel.app',
  ],
};

app.use(cors(corsOptions));

const allowlist = ['https://youtune-uploader.vercel.app', 'http://localhost:3000'];

app.use((req, res, next) => {
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    res.setHeader('Access-Control-Allow-Origin', req.header('Origin'));
  }
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  if (req.method === 'OPTIONS') res.sendStatus(200);
  else next();
});

app.use(express.json());
app.use(express.static(assetFolder));

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
      console.log('--------------server, has playlistToken and userToken');
      const jsonTokens = JSON.parse(userToken.split('j:')[1]);
      oAuth.setCredentials(jsonTokens);
      return sendToYT(
        youtube,
        videoQue,
        req.files,
        title,
        description,
        scheduleDate,
        categoryId,
        tags,
      );
    }
    res.setHeader('Set-Cookie', [
      'upload=video; Expires=Wed, 19 Jul 2023 12:55:17 GMT; HttpOnly;',
    ]);
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

app.get('/oauth2callback', (req, res) => {
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
              youtube,
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

// const sendToYT = (
//   videoQue,
//   files,
//   title,
//   description,
//   scheduleDate,
//   categoryId,
//   tags,
// ) => {
//   let index = -1;
//   if (videoQue === 0) {
//     process.exit();
//   } else {
//     index++;
//     videoQue--;
//     console.log('---------sendToYT--->', {
//       videoQue,
//       files,
//       index,
//       description: Array.isArray(description)
//         ? description[index]
//         : description,
//       title: Array.isArray(title) ? title[index] : title,
//       scheduleDate: Array.isArray(scheduleDate)
//         ? new Date(scheduleDate[index])?.toISOString()
//         : new Date(scheduleDate)?.toISOString(),
//       categoryId: Array.isArray(categoryId) ? categoryId[index] : categoryId,
//       tags: Array.isArray(tags) ? tags[index] : tags,
//     });

//     // youtube.videos.insert(
//     //   {
//     //     part: 'id,snippet,status',
//     //     notifySubscribers: false,
//     //     requestBody: {
//     //       snippet: {
//     //         title: Array.isArray(title) ? title[index] : title,
//     //         description: Array.isArray(description)
//     //           ? description[index]
//     //           : description,
//     //         categoryId: Array.isArray(categoryId)
//     //           ? categoryId[index]
//     //           : categoryId,
//     //         tags: Array.isArray(tags) ? tags[index] : tags,
//     //       },
//     //       status: {
//     //         privacyStatus: 'private',
//     //         // publishAt: Array.isArray(scheduleDate)
//     //         //   ? new Date(scheduleDate[index]).toISOString()
//     //         //   : new Date(scheduleDate).toISOString(),
//     //       },
//     //     },
//     //     media: {
//     //       body: fs.createReadStream(files[index].filename),
//     //     },
//     //   },
//     //   // {
//     //   //   // Use the `onUploadProgress` event from Axios to track the
//     //   //   // number of bytes uploaded to this point.
//     //   //   onUploadProgress: evt => {
//     //   //     const progress = (evt.bytesRead / fileSize) * 100;
//     //   //     readline.clearLine(process.stdout, 0);
//     //   //     readline.cursorTo(process.stdout, 0, null);
//     //   //     process.stdout.write(`${Math.round(progress)}% complete`);
//     //   //   },
//     //   // },
//     //   (err, data) => {
//     //     console.log(err, data);
//     //     console.log('Done');
//     //     sendToYT(
//     //       videoQue,
//     //       files,
//     //       title,
//     //       description,
//     //       scheduleDate,
//     //       categoryId,
//     //       tags,
//     //     );
//     //   },
//     // );
//   }
// };

// app.post('/updateVideo', (req, res) => {
//   const { videoId, title } = req.body;
//   // const jsonTokens = JSON.parse(userTokens.split('j:')[1]);
//   // oAuth.setCredentials(jsonTokens);
//   console.log('--------/updateVideo--->', videoId, title);
//   return youtube.videos
//     .update({
//       part: 'id,snippet,status',
//       requestBody: {
//         id: videoId,
//         snippet: {
//           title,
//           categoryId: 22,
//         },
//       },
//     })
//     .then(
//       response => {
//         console.log('updateVideo response.data -->', response.data);
//         res.send(response.data);
//       },
//       err => {
//         console.error('Execute error', err);
//       },
//     );
// });

configPassport(app, express);

app.use('/', routes);

app.listen(port, () => console.log(`Server is listening on port ${port}`));
