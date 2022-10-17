const fetch = require('cross-fetch');

const data = {
  'result': {
    'tags': [
      {
        'confidence': 98.4662017822266,
        'tag': {
          'en': 'book jacket'
        }
      },
      {
        'confidence': 77.58984375,
        'tag': {
          'en': 'jacket'
        }
      },
      {
        'confidence': 58.2133979797363,
        'tag': {
          'en': 'wrapping'
        }
      },
      {
        'confidence': 38.989315032959,
        'tag': {
          'en': 'covering'
        }
      }
      
    ]
  },
  'status': {
    'text': '',
    'type': 'success'
  }
};

async function imaggaAPI(imgURL) {

  const url =
  'https://api.imagga.com/v2/tags?image_url=' + encodeURIComponent(imgURL);

  const res = await fetch(url, {
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${process.env.IMAGGA_KEY}:${process.env.IMAGGA_SECRET}`, 'binary').toString('base64'),
      'Accept': 'application/json'
    }
  });
  const body = await res.json();
  return body;
}


function mungeData(data) {
  const result = data.result.tags.map((datum) => {
    const newObj = {
      confidence: datum.confidence,
      tag: datum.tag.en
    };
    return newObj;
  });
  return result;
}

async function addMemes(memeUrlArray) {
  const promises = memeUrlArray.map(async (url) => {
    const results = await imaggaAPI(url);
    const tags = mungeData(results);
    const newObj = {
      url,
      tags
    };
    return newObj;
  });

  const analysis = await Promise.all(promises);
  return analysis;
}
//this is a single use function we only call this to seed our database

module.exports = {
  imaggaAPI, addMemes
};
