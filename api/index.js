const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const youtube = require('youtube-api');
const uuid = require('uuid').v4;
const cors = require('cors');
// const readline = require('readline');
const multer = require('multer');
const open = require('open');
const fs = require('fs');
const creds = require('../client_secret.json');

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
  origin: ['http://localhost:3000', 'https://youtune-uploader-cwyn.vercel.app'],
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
      scope: 'https://www.googleapis.com/auth/youtube.upload',
    }),
  );
});

app.post('/uploadVideo', uploadVideoFile, (req, res) => {
  console.log('------------uploadVideo--->', {
    file: req.file,
    files: req.files,
    body: req.body,
  });

  if (req.files) {
    const { title, description } = req.body;

    console.log('------------post--->', {
      title,
      description,
      files: req.files,
    });

    const filename = req.files;
    const videoQue = Object.keys(filename).length;

    // return sendToYT(videoQue, filename, title, description);
    return res.send(
      oAuth.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/youtube.upload',
        state: JSON.stringify({
          filename: req.files,
          title,
          description,
          videoQue,
        }),
      }),
    );
  }
});

const sendToYT = (videoQue, files, title, description) => {
  let index = -1;
  if (videoQue === 0) {
    process.exit();
  } else {
    index++;
    videoQue--;
    console.log('---------sendToYT--->', {
      videoQue,
      files,
      description: Array.isArray(description) ? description[index] : description,
      title: Array.isArray(title) ? title[index] : title,
    });
    youtube.videos.insert(
      {
        part: 'id,snippet,status',
        notifySubscribers: false,
        requestBody: {
          snippet: {
            title: Array.isArray(title) ? title[index] : title,
            description: Array.isArray(description) ? description[index] : description,
          },
          status: {
            privacyStatus: 'private',
          },
        },
        media: {
          body: fs.createReadStream(files[index].filename),
        },
      },
      // {
      //   // Use the `onUploadProgress` event from Axios to track the
      //   // number of bytes uploaded to this point.
      //   onUploadProgress: evt => {
      //     const progress = (evt.bytesRead / fileSize) * 100;
      //     readline.clearLine(process.stdout, 0);
      //     readline.cursorTo(process.stdout, 0, null);
      //     process.stdout.write(`${Math.round(progress)}% complete`);
      //   },
      // },
      (err, data) => {
        console.log(err, data);
        console.log('Done');
        sendToYT(videoQue, files, title, description);
      },
    );
  }
};

app.get('/oauth2callback', (req, res) => {
  const { filename, title, description, videoQue, fileSize } = JSON.parse(
    req.query.state,
  );
  // console.log('-----oauth2callback--------->', {
  //   filename,
  //   title,
  //   description,
  //   fileSize,
  // });
  oAuth.getToken(req.query.code, (err, tokens) => {
    if (err) {
      console.log('err');
      return;
    }

    oAuth.setCredentials(tokens);
    console.log('-------tokens------>', tokens);
    // hack to close the window
    res.send("<script>window.close();</script > ");
    return sendToYT(videoQue, filename, title, description);
  });
});

configPassport(app, express);

app.use('/', routes);

app.listen(port, () => console.log(`Server is listening on port ${port}`));
