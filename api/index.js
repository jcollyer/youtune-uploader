const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

require('../server/config/environment');
require('../server/database');

const routes = require('./routes/index.js');
const configPassport = require('../server/passport/config');

const assetFolder = path.resolve(__dirname, '../dist/');
const port = process.env.PORT;
const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://youtune-uploader-collyerdesign-gmailcom.vercel.app',
    'https://youtune-uploader.vercel.app',
  ],
};

app.use(cors(corsOptions));

const allowlist = [
  'https://youtune-uploader.vercel.app',
  'http://localhost:3000',
];

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

configPassport(app, express);

app.use('/', routes);

app.use(express.static(__dirname + '/tmp'));
app.use('/tmp', express.static('tmp'));

app.listen(port, () => console.log(`Server is listening on port ${port}`));
