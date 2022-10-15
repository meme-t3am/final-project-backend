const { Router } = require('express');
const { addMemes, imaggaAPI } = require('../../APIServices');

module.exports = Router()
  .post('/', async (req, res) => {
    const resp = await imaggaAPI(req.body.url);
    res.json(resp);
  })
  .post('/data', async (req, res) => {
    const resp = await addMemes(req.body);
    res.json(resp);
  });
