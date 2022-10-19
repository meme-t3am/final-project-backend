const { Router } = require('express');
const { addMemes, imaggaAPI } = require('../../APIServices');
const Meme = require('../models/Meme');

module.exports = Router()
  .post('/', async (req, res) => {
    const resp = await imaggaAPI(req.body.url);
    res.json(resp);
  })
  .post('/data', async (req, res) => {
    if (!Array.isArray(req.body)) {
      res.status(400).send({
        message: 'Body must be an array!'
      });
    } else if (!req.body.every((x) => typeof x === 'string')) {
      res.status(400).send({
        message: 'Elements in the array must be a string!'
      });
    } else {
      const resp = await addMemes(req.body);
      res.json(resp);
    }
  })
  .get('/', async (req, res) => {
    const resp = await Meme.getAll();
    res.json(resp);
  });
