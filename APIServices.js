const fetch = require('cross-fetch');


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




async function addMemes(memeUrlArray) {
  const promises = memeUrlArray.map((url) => imaggaAPI(url));
  //URL: url, analysis: anaylisObject
  const analysis = await Promise.all(promises);
  return analysis;
}
//this is a single use function we only call this to seed our database

module.exports = {
  imaggaAPI, addMemes
};
