const { Router } = require('express');
const {
  addMemes,
  APICall,
  ConcurrencyLimitError,
} = require('../../APIServices');
const Meme = require('../models/Meme');

module.exports = Router()
  /**
   * test to make sure API is working
   */
  .post('/', async (req, res) => {
    const resp = await APICall(req.body.url);
    res.json(resp);
  })
  /**
   * takes in post request and checks that its receiving an array
  */
  .post('/data', async (req, res) => {
    if (!Array.isArray(req.body)) {
      res.status(400).send({
        message: 'Body must be an array!',
      });
    } else if (!req.body.every((x) => typeof x === 'string')) {
      res.status(400).send({
        message: 'Elements in the array must be a string!',
      });
    } else {
      try {
        const resp = await addMemes(req.body);
        res.json(resp);
      } catch (e) {
        if (e instanceof ConcurrencyLimitError) {
          res.status(429).send({
            message: 'Concurrency limit reached for APICall.',
          });
          // eslint-disable-next-line no-console
        } else {
          console.log('error', e);
          res.status(500);
        }
      }
    }
  })
  .get('/', async (req, res) => {
    const resp = await Meme.getAll();
    res.json(resp);
  });
