# Carrot Cake

## Quick Start

#### Setup

```bash
npm install

# Install MongoDB
$ brew tap mongodb/brew
$ brew install mongodb-community
```

Start the database
```bash
$ brew services start mongodb-community
```

#### for Development

Start the client
```bash
$ npm run start
```
or
```
$ npm run start:client
```

Start the server
```bash
$ npm run start:server
```

#### for Production

```bash
$ npm run build
$ npm start:server
```

#### for Deployment to Heroku

```bash
$ git push heroku master
```

#### for Heroku Logs (using papertrail)

```bash
$ heroku addons:open papertrail
```



#### Other Commands

```bash
npm start
npm test
npm run lint
npm run lint:fix
npm run test:verbose
npm run test:coverage
npm run test:watch-client
npm run test:watch-server
```
