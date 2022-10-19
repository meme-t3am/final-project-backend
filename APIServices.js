const fetch = require('cross-fetch');
const Meme = require('./lib/models/Meme');
const Tag = require('./lib/models/Tag');
const UserImage = require('./lib/models/UserImage');
const UserTag = require('./lib/models/UserTag');

class ConcurrencyLimitError extends Error {}


async function addUserImages(url, user_id) {
  const results = await imaggaAPI(url.url);
  const tags = mungeData(results);
  const image = await UserImage.insert(url.url, user_id);
  const imagePromises = tags.map((tag) =>
    UserTag.insertTag(tag.tag, image.id, tag.confidence)
  );
  await Promise.all(imagePromises);
  const newObjArr = {
    url,
    tags,
  };
  const newUrls = await returnsArr(newObjArr);
  return newUrls;
}

async function imaggaAPI(imgURL) {
  const url =
    'https://api.imagga.com/v2/tags?image_url=' + encodeURIComponent(imgURL);

  const res = await fetch(url, {
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(
          `${process.env.IMAGGA_KEY}:${process.env.IMAGGA_SECRET}`,
          'binary'
        ).toString('base64'),
      Accept: 'application/json',
    },
  });
  const body = await res.json();
  if (res.status === 403 && body.status.text.match(/concurrent/)) {
    throw new ConcurrencyLimitError();
  } else {
    return body;
  }
}

function mungeData(data) {
  const result = data.result.tags.map((datum) => {
    const newObj = {
      confidence: datum.confidence,
      tag: datum.tag.en,
    };
    return newObj;
  });
  return result;
}

//this is a single use function we only call this to seed our database
async function addMemes(memeUrlArray) {
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
// const arrOne = {
//   url: 'someUrl.jpeg',
//   tags: [
//     { tag: 'book jacket', confidence: 98 },
//     { tag: 'jacket', confidence: 77 },
//     { tag: 'wrapping', confidence: 58 },
//     { tag: 'covering', confidence: 38 },
//     { tag: 'magazine', confidence: 28 },
//     { tag: 'slick', confidence: 25 },
//     { tag: 'product', confidence: 23 },
//     { tag: 'man', confidence: 21 },
//     { tag: 'comic book', confidence: 20 },
//     { tag: 'philately', confidence: 20 },
//     { tag: 'postmark', confidence: 20 },
//     { tag: 'stamp', confidence: 20 },
//     { tag: 'letter', confidence: 20 },
//     { tag: 'mail', confidence: 20 },
//     { tag: 'old', confidence: 19 },
//     { tag: 'vintage', confidence: 19 },
//     { tag: 'circa', confidence: 17 },
//     { tag: 'male', confidence: 17 },
//     { tag: 'envelope', confidence: 17 },
//     { tag: 'creation', confidence: 17 },
//     { tag: 'retro', confidence: 17 },
//     { tag: 'ancient', confidence: 16 },
//     { tag: 'aged', confidence: 16 },
//     { tag: 'postage', confidence: 15 },
//     { tag: 'postal', confidence: 15 },
//     { tag: 'address', confidence: 15 },
//     { tag: 'card', confidence: 15 },
//     { tag: 'business', confidence: 15 },
//     { tag: 'person', confidence: 14 },
//     { tag: 'sport', confidence: 14 },
//     { tag: 'message', confidence: 14 },
//     { tag: 'people', confidence: 13 },
//     { tag: 'competition', confidence: 13 },
//     { tag: 'adult', confidence: 13 },
//     { tag: 'money', confidence: 12 },
//     { tag: 'finance', confidence: 11 },
//     { tag: 'post office', confidence: 10 },
//     { tag: 'currency', confidence: 10 },
//     { tag: 'silhouette', confidence: 10 },
//     { tag: 'player', confidence: 10 },
//     { tag: 'ball', confidence: 10 },
//     { tag: 'symbol', confidence: 10 },
//     { tag: 'printed', confidence: 9 },
//     { tag: 'close', confidence: 9 },
//     { tag: 'success', confidence: 9 },
//     { tag: 'bill', confidence: 9 },
//     { tag: 'men', confidence: 9 },
//     { tag: 'cash', confidence: 9 },
//     { tag: 'bank', confidence: 9 },
//     { tag: 'human', confidence: 8 },
//     { tag: 'game', confidence: 8 },
//     { tag: 'financial', confidence: 8 },
//     { tag: 'philatelic', confidence: 8 },
//     { tag: 'shows', confidence: 8 },
//     { tag: 'businessman', confidence: 8 },
//     { tag: 'soccer', confidence: 8 },
//     { tag: 'education', confidence: 8 },
//     { tag: 'hobby', confidence: 8 },
//     { tag: 'portrait', confidence: 8 },
//     { tag: 'print media', confidence: 8 },
//     { tag: 'alone', confidence: 8 },
//     { tag: 'student', confidence: 8 },
//     { tag: 'active', confidence: 8 },
//     { tag: 'to', confidence: 7 },
//     { tag: '1987', confidence: 7 },
//     { tag: 'championship', confidence: 7 },
//     { tag: 'modern', confidence: 7 },
//     { tag: 'football', confidence: 7 },
//     { tag: 'professional', confidence: 7 },
//     { tag: 'sign', confidence: 7 },
//     { tag: 'dollar', confidence: 7 },
//     { tag: 'action', confidence: 7 },
//     { tag: 'black', confidence: 7 },
//     { tag: 'school', confidence: 7 },
//     { tag: 'team', confidence: 7 },
//     { tag: 'face', confidence: 7 },
//     { tag: 'paper', confidence: 7 },
//     { tag: 'little', confidence: 7 },
//     { tag: 'did that work?', confidence: 7 },
//   ],
// };

async function returnsArr(userArr) {
  const resp = await fetch('http://localhost:7890/api/v1/imaggas');
  const arrayOfMemes = await resp.json();
  return arrayOfMemes.map((meme) => { 
    const newArr = meme;
    const results = compareArr(userArr, newArr);
    return results;
  });
}


function compareArr(userImageObj, memeObj) {
  const memeUrl = memeObj.url;

  const sameTags = memeObj.meme_tags.filter((obj2) =>
    userImageObj.tags.find((obj1) => obj1.tag === obj2.tag)
  );
  const totalConfidence = sameTags.reduce((acc, curr) => {
    return acc + curr.confidence;
  }, 0);
  return [totalConfidence, memeUrl];
}

module.exports = {
  imaggaAPI,
  addMemes,
  addUserImages,
  ConcurrencyLimitError
};

// divide confidence of arr1 with confidence of arr2. Closer then number is to one the more accurate it is
// ie. if confidenceNum > .75 && > 1.25 && confidence > 40, etc
// const newObj = {
//   tag: 'string',
//   confidence: 4,
//   confidenceInt: .67
// };

// if (newObj.confidence > 50 && newObj.confidenceInt is close to one) {
//   return {...newObj, confidenceScore: 1};
//   else if(newObj.confidence > 20 && > 50 && newObj.confidenceInt is less close to one ) {
//     return{...newObj, confidenceScore: .75}
//     else {
//       return { ...newObj, confidenceScore: .50}
//     }
//   }
// }
// confidence
