process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const request = supertest(app)
const connection = require('../db/connection');
const topicData = require('../db/data/test-data/topics')


describe.only('THE API ENDPOINT', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe('/api', () => {

    describe('GET Request', () => {

      describe('Status 200 - OK', () => {

        it('/ - Should return true successfully reaching this endpoint', () => {
          return request
            .get('/api')
            .expect(200)
            .then(({ body }) => {
              expect(body.ok).to.equal(true);
            });
        });

      });

      describe('Status 404 - Not Found', () => {

        it('Should return 404 with error message when passed bad route', () => {
          return request
            .get('/api/topic')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal('Route Not Found');
            });
        });

      });

    });

    describe('THE TOPICS ENDPOINT', () => {

      describe('/topics', () => {

        describe('GET Request', () => {

          describe('Status 200 - OK', () => {

            it('/ - Responds with an array of topic objects', () => {
              return request
                .get('/api/topics')
                .expect(200)
                .then(({ body }) => {
                  expect(body.topics).to.be.an('array');
                  expect(body.topics[0]).to.contain.keys('slug', 'description')
                });

            });

          });

        });

      });

    });

    describe('THE ARTICLES ENDPOINT', () => {

      describe('/articles', () => {

        describe('GET Request', () => {

          describe('Status 200 - OK', () => {

            it('Responds with an array of article objects', () => {
              return request
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                  expect(body.articles).to.be.an('array');
                  expect(body.articles[0]).to.contain.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count')
                });
            });

          });

        });

      });

    });

  });

});


