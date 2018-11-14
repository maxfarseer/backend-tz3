import app from '../bin/server';
import supertest from 'supertest';
import { cleanDb } from './utils';

const request = supertest.agent(app.callback());
const context = {};

const fixtures = {
  user: {
    username: 'login', password: 'password'
  },
};

beforeAll(() => {
  // runs before all tests in this block
  cleanDb();
});

const urlPrefix = '/api/v1/users';
describe('Users', function() {

  describe(`POST ${urlPrefix} - create user`, () => {
    it('Sign up with wrong params', async () => {
      const response = await request
        .post(`${urlPrefix}`)
        .send({ username: '', password: '' });

      expect(response.status).toBe(400);
      expect(response.body.errors.username[0]).toBe('Username should be not empty');
      expect(response.body.errors.password[0]).toBe('Password should be not empty');
    });


    it('Sign up user success', async () => {
      const response = await request
        .post(`${urlPrefix}`)
        .send(fixtures.user);

        expect(response.status).toBe(200);
        expect.anything(response.body.user._id);
        expect.anything(response.body.token);
    });

    it('Sign up existent user', async () => {
      const response = await request
        .post(urlPrefix)
        .send(fixtures.user);

      expect(response.status).toBe(400);
      expect(response.body.errors.username[0]).toBe('Alredy exists');
    });
  });

});
