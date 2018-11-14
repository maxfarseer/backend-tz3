import app from '../bin/server';
import supertest from 'supertest';
import { cleanDb, authUser } from './utils';
import User from '../src/models/users';
import Feed from '../src/models/feeds';

const request = supertest.agent(app.callback());

const fixtures = {
  user: {
    username: 'login_feed', password: 'pass'
  },
  feed: {
    title: 'Great history', content: 'Text here'
  },
  emptyFeed: {
    title: '', content: ''
  },
  token: null,
  unexistentFeedId: '12345678901234f69e3105b6',
  wrongFeedId: '123',
  editedFeed: { title: 'Great history2', content: 'New text here' }
};

const userData = {
  user: null,
  token: null
}

beforeAll(async () => {
  // runs before all tests in this block
  cleanDb();
  const user = new User(fixtures.user);
  await user.save();

  userData.user = user;
  userData.token = user.generateToken();
});

const urlPrefix = '/api/v1/feeds';
describe('Users', () => {
  describe(`POST ${urlPrefix} - create feed`, () => {

    it('Create feed without authorization', async () => {
      const response = await request
        .post(urlPrefix)
        .send({ title: 'text', content: 'content' });

      expect(response.status).toBe(401);
    });

    it('Create feed with wrong params', async () => {
      const { token } = userData;
      const response = await request
        .post(urlPrefix)
        .set('x-access-token', token)
        .send(fixtures.emptyFeed);

      expect(response.status).toBe(400);
      expect(response.body.errors.title[0]).toBe('Title should be not empty');
      expect(response.body.errors.content[0]).toBe('Content should be not empty');
    });

    it('Create feed', async () => {
      const { token } = userData;
      const response = await request
        .post(urlPrefix)
        .set('x-access-token', token)
        .send(fixtures.feed);

      const { _id: feedId } = response.body.feed;
      expect(response.status).toBe(200);

      expect(await Feed.findById(feedId)).toEqual(expect.objectContaining({
        title: fixtures.feed.title,
        content: fixtures.feed.content
      }));
    });

  });

  describe(`GET ${urlPrefix} - create feed`, () => {

    it('Get feeds', async () => {

      const { user } = userData;
      
      const feed = new Feed({ 
        ...fixtures.feed,
        creator: user._id
      });
      await feed.save();
      const { _id: id } = feed;
      const response = await request
        .get(`${urlPrefix}`)

      expect(response.status).toBe(200);
      expect(response.body.feeds).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            _id: expect.any(String),
            title: expect.any(String),
            content: expect.any(String)
          })
        ])
      );
    });
  });

  describe(`GET ${urlPrefix}/:id - get feed`, () => {

    it('Get unexistent feed', async () => {
      const response = await request
        .get(`${urlPrefix}/${fixtures.unexistentFeedId}`);

      expect(response.status).toBe(404);

    });

    it('Get feed with wrong id', async () => {
      const response = await request
        .get(`${urlPrefix}/${fixtures.wrongFeedId}`);

      expect(response.status).toBe(404);

    });

    it('Get feed', async () => {
      const { token, user } = userData;
      const feed = new Feed({ 
        ...fixtures.feed,
        creator: user._id
      });
      await feed.save();
      const { _id: id } = feed;
      const response = await request
        .get(`${urlPrefix}/${id}`)

      expect(response.status).toBe(200);
      expect(response.body.feed).toEqual(expect.objectContaining({
        title: fixtures.feed.title,
        content: fixtures.feed.content
      }));
    });
  });

  describe(`PUT ${urlPrefix} - create feed`, () => {

    it('Update feed with wrong params', async () => {
      const { token, user } = userData;
      const feed = new Feed({ 
        ...fixtures.feed,
        creator: user._id
      });
      await feed.save();
      const { _id: id } = feed;
      const response = await request
        .put(`${urlPrefix}/${id}`)
        .set('x-access-token', token)
        .send(fixtures.emptyFeed);

      expect(response.status).toBe(400);
      expect(response.body.errors.title[0]).toBe('Title should be not empty');
      expect(response.body.errors.content[0]).toBe('Content should be not empty');
    });

    it('Update feed', async () => {
      const { token, user } = userData;
      const feed = new Feed({ 
        ...fixtures.feed,
        creator: user._id
      });
      await feed.save();

      const { _id: id } = feed;
      const response = await request
        .put(`${urlPrefix}/${id}`)
        .set('x-access-token', token)
        .send(fixtures.editedFeed);

      expect(response.status).toBe(200);
      expect(await Feed.findById(feed.id)).toEqual(expect.objectContaining({
        title: fixtures.editedFeed.title,
        content: fixtures.editedFeed.content
      }));
    });
  });

  describe(`DELETE ${urlPrefix} - delete feed`, () => {

    it('Update feed', async () => {
      const { token, user } = userData;
      const feed = new Feed({ 
        ...fixtures.feed,
        creator: user._id
      });
      await feed.save();

      const { _id: id } = feed;
      const response = await request
        .delete(`${urlPrefix}/${id}`)
        .set('x-access-token', token);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(id.toHexString());
      expect(await Feed.findById(feed.id)).toBe(null);
    });

  });
  
});
