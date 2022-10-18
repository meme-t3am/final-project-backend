const fetch = require('cross-fetch');
const Meme = require('./lib/models/Meme');
const Tag = require('./lib/models/Tag');

// const data = {
//   'result': {
//     'tags': [
//       {
//         'confidence': 98.4662017822266,
//         'tag': {
//           'en': 'book jacket'
//         }
//       },
//       {
//         'confidence': 77.58984375,
//         'tag': {
//           'en': 'jacket'
//         }
//       },
//       {
//         'confidence': 58.2133979797363,
//         'tag': {
//           'en': 'wrapping'
//         }
//       },
//       {
//         'confidence': 38.989315032959,
//         'tag': {
//           'en': 'covering'
//         }
//       }
      
//     ]
//   },
//   'status': {
//     'text': '',
//     'type': 'success'
//   }
// };

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
  //this is a single use function we only call this to seed our database
  const promises = memeUrlArray.map(async (url) => {
    const results = await imaggaAPI(url);
    const tags = mungeData(results);
    const meme = await Meme.insert(url);
    const tagPromises = tags.map((tag) => 
      Tag.insertMeme(tag.tag, tag.confidence, meme.id)
    );
    await Promise.all(tagPromises);
    const newObj = {
      url,
      tags,
    };
    return newObj;
  });
  const analysis = await Promise.all(promises);
  return analysis;
}


async function returnsArr () {
  const resp = await fetch('http://localhost:7890/api/v1/imaggas');
  const res = await resp.json();
  return res;
}


returnsArr();

function compareArr (arr1, arr2) {
  const sameTags = arr2.filter((obj2) => arr1.find(obj1 => obj1.tag === obj2.tag));
  // we need to add a new key of confidenceInt. This will be obj1.confidence / obj2.confidence
  const totalConfidence = sameTags.reduce((acc, curr) => {
    return acc + curr.confidence;
  }, 0);
  return [sameTags, totalConfidence];
}




module.exports = {
  imaggaAPI, addMemes, compareArr
};
