const { response } = require('express');
const express = require('express');
const appRouter = express.Router();

const userBL = require('../models/userBL');

appRouter.post('/signup', async function(req, resp) {
    try {
      const userObj = req.body;
      const result = await userBL.register(userObj);
      resp.status(200).json(result);
    } catch (error) {
      console.error(error);
      if (error.message === 'Username already exists') {
        resp.status(409).json({ message: 'Username already exists', error: 'Username already exists' });
      } else if (error.message === 'Email address is already registered') {
        resp.status(409).json({ message: 'Email address is already registered', error: 'Email address is already registered' });
      } else {
        resp.status(500).json({ message: 'Internal server error', error: error.message });
      }
    }
  });
appRouter.post('/login', async function(req, resp) {
    try {
        const userObj = req.body;
        const result = await userBL.login(userObj);
        resp.status(200).json(result);
    } catch (error) {
        if (error.message === 'user not found') {
            resp.status(404).json({ message: 'user not found' });
        } else if (error.message === 'password is incorrect') {
            resp.status(401).json({ message: 'invalid password' });
        } else {
            resp.status(500).json({ message: 'login failed', error: error.message });
        }
    }
});
  module.exports = appRouter;