const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const youtube = require('youtube-api');
const uuid = require('uuid').v4;
const cors = require('cors');
const readline = require('readline');
const multer = require('multer');
const open = require('open');
const fs = require('fs');
const creds = require('../client_secret.json');

require('./config/environment');
require('./database');

const routes = require('./routes/index');
const configPassport = require('./passport/config');

const assetFolder = path.resolve(__dirname, '../dist/');
const port = process.env.PORT;
const app = express();

app.use(express.static(assetFolder));
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: './',
  filename(req, file, cb) {
    const newFilename = `${uuid()}-${file.originalname}`;
    console.log('------storage------>', newFilename);
    cb(null, newFilename);
  },
});

const uploadVideoFile = multer({
  storage,
}).single('videoFile');

const oAuth = youtube.authenticate({
  type: 'oauth',
  client_id: creds.web.client_id,
  client_secret: creds.web.client_secret,
  redirect_url: creds.web.redirect_uris[0],
});

app.post('/uploadVideo', uploadVideoFile, (req) => {
  if (req.file) {
    console.log('------------post--->', req.file.filename);
    const { filename } = req.file;
    const { title, description } = req.body;
    open(
      oAuth.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/youtube.upload',
        state: JSON.stringify({
          filename,
          title,
          description,
        }),
      }),
    );
  }
});

app.get('/oauth2callback', (req, res) => {
  res.redirect('/upload');
  const { filename, title, description, fileSize } = JSON.parse(req.query.state);
  console.log('-------------->', { title, description, fileSize });
  oAuth.getToken(req.query.code, (err, tokens) => {
    if (err) {
      console.log('err');
      return;
    }
    oAuth.setCredentials(tokens);

    youtube.videos.insert(
      {
        part: 'id,snippet,status',
        notifySubscribers: false,
        requestBody: {
          snippet: {
            title,
            description,
          },
          status: {
            privacyStatus: 'private',
          },
        },
        media: {
          body: fs.createReadStream(filename),
        },
      },
      {
        // Use the `onUploadProgress` event from Axios to track the
        // number of bytes uploaded to this point.
        onUploadProgress: evt => {
          const progress = (evt.bytesRead / fileSize) * 100;
          readline.clearLine(process.stdout, 0);
          readline.cursorTo(process.stdout, 0, null);
          process.stdout.write(`${Math.round(progress)}% complete`);
        },
      },
      (err, data) => {
        console.log(err, data);
        console.log('Done');
        process.exit();
      },
    );
  });
});

configPassport(app, express);

app.use('/', routes);

app.listen(port, () => console.log(`Server is listening on port ${port}`));
