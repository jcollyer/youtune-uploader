const express = require('express');

const router = express.Router();

module.exports = router;

router.post('/setCookie', (req, res) => {
    // read cookies
    console.log(req.cookies);
  
    // let options = {
    //   maxAge: 1000 * 60 * 15, // would expire after 15 minutes
    //   httpOnly: true, // The cookie only accessible by the web server
    //   // signed: true, // Indicates if the cookie should be signed
    // };
  
    // Set cookie
    // res.cookie('cookieFromEndpoint', 'cookieValueFromEndpoint', options); // options is optional
    // res.setHeader('Set-Cookie', ['ck=value; Expires="Session"; HttpOnly=true;']);
    res.setHeader('Set-Cookie', ['ck=value; HttpOnly; Path=/']);
    res.status(200).send({ message: 'set cookie'});
  });