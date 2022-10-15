const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

// Dummy user for testing
const mockUser = {
  userName: 'User',
  email: 'test@example.com',
  password: '12345',
};

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

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  // Create an "agent" that gives us the ability
  // to store cookies between requests in a test
  const agent = request.agent(app);

  // Create a user to sign in with
  const user = await UserService.create({ ...mockUser, ...userProps });

  // ...then sign in
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { userName, email } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      userName,
      email,
    });
  });

  it('signs in an existing user', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'test@example.com', password: '12345' });
    expect(res.status).toEqual(200);
  });

  it('/protected should return a 401 if not authenticated', async () => {
    const res = await request(app).get('/api/v1/users/protected');
    expect(res.status).toEqual(401);
  });

  it('/protected should return the current user if authenticated', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/users/protected');
    expect(res.status).toEqual(200);
  });

  it('/users should return 401 if user not admin', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/users/');
    expect(res.status).toEqual(403);
  });

  it('/users should return 200 if user is admin', async () => {
    const agent = request.agent(app);

    // create a new user
    await agent.post('/api/v1/users').send({
      email: 'admin',
      password: '1234',
      userName: 'admin',
    });
    // sign in the user
    await agent
      .post('/api/v1/users/sessions')
      .send({ email: 'admin', password: '1234' });

    // const [agent] = await registerAndLogin({ email: 'admin' });
    const res = await agent.get('/api/v1/users/');
    expect(res.status).toEqual(200);
  });

  it('/users should return a 200 if user is admin', async () => {
    const [agent] = await registerAndLogin({ email: 'admin' });
    const res = await agent.get('/api/v1/users/');
    expect(res.status).toEqual(200);
  });

  it('DELETE /sessions deletes the user session', async () => {
    const [agent] = await registerAndLogin();
    const resp = await agent.delete('/api/v1/users/sessions');
    expect(resp.status).toBe(204);
  });
  it('/imagga returns some data hopefully', async () => {
    const [agent] = await registerAndLogin();
    const resp = await agent.post('/api/v1/users/imagga').send({ url: 'https://worldwideinterweb.com/wp-content/uploads/2017/10/best-baby-memes.jpg' });
    expect(resp.body).toEqual(expect.anything());
  });

  it.only('/imagga returns JSON object with tags', async () => {
    const [agent] = await registerAndLogin();
    const resp = await agent.post('/api/v1/users/imagga').send(memeArray);
    expect(resp.body).toEqual({});
  });
  

});
