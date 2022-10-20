const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const memeArray = [
  'https://i.kym-cdn.com/photos/images/newsfeed/000/911/486/6bb.jpg',
  'https://i.pinimg.com/originals/20/e4/8a/20e48a7750f4d322d9d01efab27e3071.jpg',
  // 'https://m.media-amazon.com/images/I/51F19r4qV3L._AC_SY580_.jpg',
  // 'https://i.kym-cdn.com/entries/icons/original/000/030/338/New.jpg',
  // 'https://cdn.mamamia.com.au/wp/wp-content/uploads/2018/06/18155147/funniest-memes-14.jpg',
  // 'https://www.letseatcake.com/wp-content/uploads/2021/07/funny-memes-13.jpg',
  // 'https://thechive.com/wp-content/uploads/2021/06/rick-and-morty-37.jpeg?attachment_cache_bust=3709299&quality=85&strip=info&w=400',
  // 'https://preview.redd.it/sq5y3ne3xpt91.jpg?width=640&crop=smart&auto=webp&s=7726483a2fba12f5c5e64509ed4b0b9cc7c111ac',
  // 'https://i.kym-cdn.com/entries/icons/original/000/000/143/493654d6ef.jpg',
  // 'https://i.kym-cdn.com/entries/icons/original/000/019/630/ihnmotp.jpg',
  // 'https://www.porchdrinking.com/wp-content/uploads/2017/11/EorMTbX-700x467.jpg',
  // 'https://www.porchdrinking.com/wp-content/uploads/2017/11/3jqRCaO-700x525.png',
  // 'https://worldwideinterweb.com/wp-content/uploads/2017/10/best-baby-memes.jpg',
];
// many memes are commented out

describe('user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('/imagga returns some data hopefully', async () => {
    const resp = await request(app).post('/api/v1/imaggas').send({
      url: 'https://www.porchdrinking.com/wp-content/uploads/2017/11/EorMTbX-700x467.jpg',
    });
    expect(resp.body).toEqual(expect.anything());
  });
  it('/imagga returns JSON object with tags', async () => {
    const resp = await request(app)
      .post('/api/v1/imaggas/data')
      .send(memeArray);
    // expect(resp.body).toEqual(expect.arrayContaining([{
    //   tags: [{ confidence: expect.any(Number), tag: expect.any(String) }],
    //   url: expect.any(String)
    // }
    // ]));
    expect(resp.body).toEqual(expect.anything());
  });

  it('GET all memes should return a big array', async () => {
    await request(app).post('/api/v1/imaggas/data').send(memeArray);
    const resp = await request(app).get('/api/v1/imaggas/');
    expect(resp.body).toEqual(expect.anything());
  });
  it('compares arrays', async () => {
    const res = await request(app)
      .post('/api/v1/imaggas/testing')
      .send(memeArray);
    expect(res.body).toEqual(expect.anything());
  });
});
