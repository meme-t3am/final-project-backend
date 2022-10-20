// const fetch = require('cross-fetch');
const Throttle = require('superagent-throttle');
const request = require('superagent');

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

/**
 * script to be called node seed-database.js
 * this will seed database by passing the memeArray as the body of the fetch call(to the API)
 */
// fetch('http://localhost:7890/api/v1/imaggas/data', {
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   method: 'POST',
//   body: JSON.stringify(memeArray),
// }).then((response) => {
//   // eslint-disable-next-line no-console
//   console.log(response.status);
//   process.exit(response.status < 400 ? 0 : 1);
// });

const throttle = new Throttle({
  active: true,
  rate: 1,
  ratePer: 10000,
  concurrent: 1,
});

request
  .post('https://final-project-backend2.herokuapp.com/api/v1/imaggas/data')
  .send(memeArray)
  .use(throttle.plugin())
  .set('Accept', 'application/json')
  .then((err, res) => {
    return res.status;
  });

// function APICall(imgURL) {
//   const endpoint =
//     'https://api.imagga.com/v2/tags?image_url=' + encodeURIComponent(imgURL);

//   const res = request
//     .post(endpoint)
//     .set(
//       'Authorization',
//       'Basic ' +
//         Buffer.from(
//           `${process.env.IMAGGA_KEY}:${process.env.IMAGGA_SECRET}`,
//           'binary'
//         ).toString('base64')
//     )
//     .use(throttle.plugin())
//     .end((err, res) => {
//       const body = res.json();
//       return body;
//     });
//   return res;
// }
