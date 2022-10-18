const { Router } = require('express');
const { imaggaAPI } = require('../../APIServices');
const { addUserImages } = require('../../UserImagesServices');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .post('/', async (req, res) => {
    const resp = await imaggaAPI(req.body.url);
    res.json(resp);
  })
  .post('/data', authenticate, async (req, res) => {
    console.log('req.body', req.body);
    const resp = await addUserImages(req.body, req.user.id);
    res.json(resp);
  });
