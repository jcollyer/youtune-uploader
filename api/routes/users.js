const express = require('express');
const { User } = require('../../server/database/schemas');
const router   = express.Router();
module.exports = router;

router.post('/checkusername', async (req, res) => {
  const username = req.body.username.toLowerCase();
  try {
    const data = User.find({ username });
    if (data && data[0]) {
      res.send({ available: false, message: 'Username exists', username });
    } else {
      res.send({ available: true, message: 'Username available', username });
    }
  } catch (error) { 
    res.status(400).send({ message: 'Check username failed', err, username });
  }
});
