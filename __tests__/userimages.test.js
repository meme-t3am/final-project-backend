const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const userImage = {
  url: 'https://www.thesun.co.uk/wp-content/uploads/2016/06/nintchdbpict000242868564.jpg',
};

const mockUser = {
  userName: 'User',
  email: 'test@example.com',
  password: '12345',
};

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

  it.only('/userimages return the user input image', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.post('/api/v1/userimages/data').send(userImage);
    expect(res.body).toEqual({});
  });

  it('dummy', async () => {
    const res = await request(app).post('/api/v1/userimages').send(userImage);
    expect(res.body).toEqual([]);
  });
});
