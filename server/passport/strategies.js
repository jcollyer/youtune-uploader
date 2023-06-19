const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../database/schemas');
const Strategies = module.exports;

Strategies.local = new LocalStrategy(async (username, password, done) => {
  try {
    const data = await User.findOne({ username});
    if(!data){
      return done(null, false, { message: 'Username doesn\'t exist' });
    }
    if (!data.validPassword(password)) {
      return done(null, false, { message: 'Incorrect username or password' });
    }
    return done(null, data);
  } catch (error) { 
    return done(error); 
  }
});