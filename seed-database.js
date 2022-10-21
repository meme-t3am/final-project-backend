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
  // 'https://ballislife.com/wp-content/uploads/2013/03/lebron-aging.jpg',
  // 'https://i.redd.it/87bkbimqjku91.png',
  // 'https://i.pinimg.com/736x/5c/3e/69/5c3e698c9aa48da1af4d97201df25349.jpg',
  // 'https://i.redd.it/fs8gf4ame5861.jpg',
  // 'https://i.chzbgr.com/full/9320452096/hCB1E85E7/meme-mini-keanu-album-cover-what-i-think-ill-say-what-i-actually-say',
  // 'https://i.redd.it/jxbvq7ibzcs91.png',
  // 'https://m.media-amazon.com/images/I/51yTM6mIVFL.jpg',
  // 'https://img-9gag-fun.9cache.com/photo/a47PYPy_460s.jpg',
  // 'https://i.redd.it/m63ph6fgiyp81.jpg',
  // 'https://i.kym-cdn.com/entries/icons/facebook/000/015/319/do_you_want_ants.jpg',
  // 'https://i.imgflip.com/6pwtc9.jpg',
  // 'https://i.redd.it/vgo85g9ozfj91.jpg',
  // 'https://i.pinimg.com/550x/c1/7e/a3/c17ea3a0b93216e7f7de918fcef39447.jpg',
  // 'https://i.insider.com/5d39f6aba13c955d0b76fa94?width=750&format=jpeg&auto=webp',
  // 'https://s3-alpha.figma.com/hub/file/1263286233/d15bfef8-980d-4aa9-82f1-e04afac11025-cover.png',
  // 'https://i.kym-cdn.com/entries/icons/original/000/011/057/mckayla_not.jpeg',
  // 'https://pbs.twimg.com/tweet_video_thumb/DxM8ppvUwAM40QE.jpg',
  // 'https://img.buzzfeed.com/buzzfeed-static/static/2020-08/12/2/enhanced/f0d82f7856c0/original-724-1597200061-2.png',
  // 'https://sayingimages.com/wp-content/uploads/drinking-how-many-meme.jpg',
  // 'https://images3.memedroid.com/images/UPLOADED330/626daaa07b48d.jpeg',
  // 'https://i.pinimg.com/originals/f9/3f/c9/f93fc9a8f24b57ba26714dca5a292783.jpg',
  // 'https://i.ytimg.com/vi/uiQAQM-Gm-M/maxresdefault.jpg',
  // 'https://nationalzoo.si.edu/sites/default/files/panda-eat-all-the-cake_0.jpg',
  // 'https://i.chzbgr.com/full/9340630784/h357E9FA4/text-when-you-write-10-lines-of-code-without-searching-on-google-itaint-much-but-its-honest-work',
  // 'https://fleepbleep.com/wp-content/uploads/2020/04/Before-LockDown.png',
  // 'https://preview.redd.it/n2t5m5hqhot31.jpg?width=640&crop=smart&auto=webp&s=673076bfe68b3f45d9c0325885eb9a9b903b437e',
  // 'https://images7.memedroid.com/images/UPLOADED296/627fda801dfb8.jpeg',
  // 'https://imgix.ranker.com/user_node_img/50053/1001047986/original/i-m-not-impressed-freestyle-list-photo-u1?auto=format&q=60&fit=crop&fm=pjpg&dpr=2&w=375',
  // 'https://www.boredpanda.com/blog/wp-content/uploads/2022/03/clipimage-6228c931b0f00__700.jpg',
  // 'https://mamasgeeky.com/wp-content/uploads/2020/04/rick-and-morty-meme-3.jpg.webp',
  // 'https://images7.memedroid.com/images/UPLOADED685/630d1b8f009f8.jpeg'
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
  .post('https://allegori-backend.herokuapp.com/api/v1/imaggas/data')
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
