const express = require('express');
const crypto = require('crypto');
const userDB = require('../database/users');
const router = express.Router();

const HASH_KEY = 'f49be88f-b607-428b-b5ba-413dd1abcde1';

function getHash(password) {
  return crypto.createHmac('sha512', HASH_KEY).update(password).digest('hex')
}

router.post('/users/:username', (req, res) => {
  userDB.create({
    username: req.params.username,
    password: getHash(req.body.password)
  });
  res.json({
    status: 'success',
    result: 'Success'
  });
});

router.post('/users/:username/session', (req, res) => {
  let username = req.params.username;
  let password = getHash(req.body.password);

  let userInfo = userDB.findByUsername(username);
  if (userInfo.password === password) {
    req.session.username = username;
    res.json({
      status: 'success',
      result: 'success'
    });
  } else {
    req.session.destroy();
    throw {
      status: 401,
      result: 'Incorrect Password'
    };
  }
});

module.exports = router;