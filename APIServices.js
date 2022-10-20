const fetch = require('cross-fetch');
const Meme = require('./lib/models/Meme');
const Tag = require('./lib/models/Tag');
const UserImage = require('./lib/models/UserImage');
const UserTag = require('./lib/models/UserTag');

/**
 * this class throws error when concurrency limit has been reached(by API)
 */
class ConcurrencyLimitError extends Error {}

/**
 *
 * @param {string} imgURL
 * @returns an object of URL, and an array of tags and confidence
 */

const request = require('superagent');
const Throttle = require('superagent-throttle');

const throttle = new Throttle({
  active: true,
  rate: 2,
  ratePer: 1000,
  concurrent: 1, 
});

const agent = request.agent().use(throttle.plugin());

function APICall(imgURL) {
  const endpoint =
    'https://api.imagga.com/v2/tags?image_url=' + encodeURIComponent(imgURL);

  const res = agent
    .get(endpoint)
    .auth(process.env.IMAGGA_KEY, process.env.IMAGGA_SECRET)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .then((res) => {
      const body = res.body;
      return body;
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log('err', err);
    });
  return res;
}

/**
 *
 * @param {object} data
 * @returns simplifies the data from the API (tag and confidence)
 */
function shapeAPIData(data) {
  const result = data.result.tags.map((datum) => {
    const newObj = {
      confidence: datum.confidence,
      tag: datum.tag.en,
    };
    return newObj;
  });
  return result;
}

/**
 *
 * @param {array} userImageArr
 * @returns an array with the totalConfidence of image and the meme's URL
 */
async function getAllAndMap(userImageArr) {
  const resp = await fetch('http://localhost:7890/api/v1/imaggas');
  const arrayOfMemes = await resp.json();
  return arrayOfMemes.map((meme) => {
    const memeArray = meme;
    const results = compareAiTags(userImageArr, memeArray);
    return results;
    
  });
}

/**
 *
 * @param {object} userImageObj this is the result of the API and data munging-for the image user inputed
 * @param {object} memeObj getAllAndMap() maps over array and returns meme object
 * @returns an array with the totalConfidence of image and the meme's URL
 */
function compareAiTags(userImageObj, memeObj) {
  const memeUrl = memeObj.url;

  const sameTags = memeObj.meme_tags.filter((obj2) =>
    userImageObj.tags.find((obj1) => obj1.tag === obj2.tag)
  );
  const totalConfidence = sameTags.reduce((acc, curr) => {

    return acc + curr.confidence;
  }, 0);
  return [totalConfidence, memeUrl];
}



/**
 *
 * @param {object} url {url: 'url'}
 * @param {string} user_id
 * @returns an array of matching meme URL's to the inputed URL
 */
async function addUserImages(url, user_id) {
  const results = await APICall(url.url);
  const tags = shapeAPIData(results);
  const image = await UserImage.insert(url.url, user_id);
  const imagePromises = tags.map((tag) =>
    UserTag.insertTag(tag.tag, image.id, tag.confidence)
  );
  await Promise.all(imagePromises);
  const newArrObjects = {
    url,
    tags,
  };
  const newUrls = await getAllAndMap(newArrObjects);
  return newUrls;
}

/**
 *
 * @param {array} memeUrlArray
 * @returns this is a single use function we only call this to seed our database
 */
async function addMemes(memeUrlArray) {
  const promises = memeUrlArray.map(async (url) => {
    const results = await APICall(url);
    const tags = shapeAPIData(results);
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

module.exports = {
  APICall,
  addMemes,
  addUserImages,
  ConcurrencyLimitError,
};

// divide confidence of arr1 with confidence of arr2. Closer then number is to one the more accurate it is
// ie. if confidenceNum > .75 && > 1.25 && confidence > 40, etc
// const newObj = {
//   tag: 'string',
//   confidence: 4,
//   confidenceInt: .67
// };

// if (newObj.confidence > 50 && newObj.confidenceInt is close to one) {
//   return {...newObj, confidenceScore: 100};
//   else if(newObj.confidence > 20 && > 50 && newObj.confidenceInt is less close to one ) {
//     return{...newObj, confidenceScore: .75}
//     else {
//       return { ...newObj, confidenceScore: .50}
//     }
//   }
// }
// const newObj = {
//   tag: 'string',
//   confidence: 4,
//   confidenceInt: .67
//    confidenceScore: 80
// };
