const { Router } = require('express');
const { addUserImages } = require('../../APIServices');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .post('/data', authenticate, async (req, res) => {
    const resp = await addUserImages(req.body, req.user.id);
    res.json(resp);
  });
