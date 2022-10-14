const memeArray = [
  'https://i.kym-cdn.com/photos/images/newsfeed/000/911/486/6bb.jpg',
  'https://i.pinimg.com/originals/20/e4/8a/20e48a7750f4d322d9d01efab27e3071.jpg',
  'https://m.media-amazon.com/images/I/51F19r4qV3L._AC_SY580_.jpg',
  'https://i.kym-cdn.com/entries/icons/original/000/030/338/New.jpg',
  'https://cdn.mamamia.com.au/wp/wp-content/uploads/2018/06/18155147/funniest-memes-14.jpg',
  'https://www.letseatcake.com/wp-content/uploads/2021/07/funny-memes-13.jpg',
  'https://thechive.com/wp-content/uploads/2021/06/rick-and-morty-37.jpeg?attachment_cache_bust=3709299&quality=85&strip=info&w=400',
  'https://preview.redd.it/sq5y3ne3xpt91.jpg?width=640&crop=smart&auto=webp&s=7726483a2fba12f5c5e64509ed4b0b9cc7c111ac',
  'https://i.kym-cdn.com/entries/icons/original/000/000/143/493654d6ef.jpg',
  'https://i.kym-cdn.com/entries/icons/original/000/019/630/ihnmotp.jpg',
  'https://www.porchdrinking.com/wp-content/uploads/2017/11/EorMTbX-700x467.jpg',
  'https://www.porchdrinking.com/wp-content/uploads/2017/11/3jqRCaO-700x525.png',
  'https://worldwideinterweb.com/wp-content/uploads/2017/10/best-baby-memes.jpg',
];

console.log('memeArray', memeArray);

const got = require('got'); // if you don't have "got" - install it with "npm install got"

const apiKey = 'acc_400a422a4c240cb';
const apiSecret = 'e4b20fa9c5f86559fd6670ad2258944a';

const imageUrl =
  'https://docs.imagga.com/static/images/docs/sample/japan-605234_1280.jpg';
const url =
  'https://api.imagga.com/v2/tags?image_url=' + encodeURIComponent(imageUrl);

async function imaggaAPI() {
  const res = await got(url, { username: apiKey, password: apiSecret });
  console.log('res.body', res.body);
}

imaggaAPI();

// (async () => {
//   try {
//     const response = await got(url, { username: apiKey, password: apiSecret });
//     console.log(response.body);
//   } catch (error) {
//     console.log(error.response.body);
//   }
// })();