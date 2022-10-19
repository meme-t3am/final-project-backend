const { Router } = require('express');
const { addMemes, imaggaAPI, ConcurrencyLimitError } = require('../../APIServices');
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
      try { 
        const resp = await addMemes(req.body);
        res.json(resp);
      } catch (e) { 
        if (e instanceof ConcurrencyLimitError) {
          res.status(429).send({
            message: 'Concurrency limit reached for imaggaAPI.'
          });
        } else { console.log('error', e);
          res.status(500);
        }
      } 
    }
  })
  .get('/', async (req, res) => {
    const resp = await Meme.getAll();
    res.json(resp);
  });
