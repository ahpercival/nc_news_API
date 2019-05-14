process.env.NODE_ENV = 'test';

const chai = require('chai')
const { expect } = chai;
const supertest = require('supertest');
const app = require('../app');
const request = supertest(app)
const connection = require('../db/connection');
const chaiSorted = require('chai-sorted')

chai.use(chaiSorted)

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
                  body.articles.forEach(article => {
                    expect(article).to.contain.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count')
                  })
                });
            });

            it('Should return articles sorted by date in descending order as default', () => {
              return request
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                  expect(body.articles).to.be.descendingBy('created_at')
                });

            });

          });

          describe('/?', () => {

            describe('Status 200 - OK', () => {

              it('Should accept sort-by query which sorts the articles when passed any valid column', () => {
                return request
                  .get('/api/articles?sort_by=author')
                  .expect(200)
                  .then(({ body }) => {
                    expect(body.articles).to.be.descendingBy('author')
                  });

              });

              it('Should accept asc order query which returns articles in ascending order', () => {
                return request
                  .get('/api/articles?order=asc')
                  .expect(200)
                  .then(({ body }) => {
                    expect(body.articles).to.be.ascendingBy('created_at')
                  });

              });

              it('Filters articles by a valid username value specified in the query', () => {
                return request
                  .get('/api/articles?author=butter_bridge')
                  .expect(200)
                  .then(({ body }) => {
                    body.articles.forEach(article =>
                      expect(article.author).to.eql('butter_bridge')
                    )
                  });

              });

              it('Filters articles by a valid topic value specified in the query', () => {
                return request
                  .get('/api/articles?topic=mitch')
                  .expect(200)
                  .then(({ body }) => {
                    body.articles.forEach(article =>
                      expect(article.topic).to.eql('mitch')
                    )
                  });

              });

            });

            describe('Status 400 - Bad Request', () => {

              it('Should respond with 400 and error message if passed an invalid column to sort by', () => {
                return request
                  .get('/api/articles?sort_by=a')
                  .expect(400)
                  .then(({ body }) => {
                    expect(body.msg).to.eql('Unable to sort - Invalid column')
                  });
              });

              it('Should respond with 400 and error message if passed an invalid order request', () => {
                return request
                  .get('/api/articles?order=a')
                  .expect(400)
                  .then(({ body }) => {
                    expect(body.msg).to.eql('Invalid order request')
                  });
              });

            });

            describe('Status 404 - Not Found', () => {

              it('Should respond with 404 and error message if passed invalid username', () => {
                return request
                  .get('/api/articles?author=a')
                  .expect(404)
                  .then(({ body }) => {
                    expect(body.msg).to.eql('No articles found')
                  });

              });

              it('Should respond with 404 and error message if passed invalid topic', () => {
                return request
                  .get('/api/articles?topic=a')
                  .expect(404)
                  .then(({ body }) => {
                    expect(body.msg).to.eql('No articles found')
                  });

              });

            });

          });

          describe('/:article_id', () => {

            describe('GET Request', () => {

              describe('Status 200 - OK', () => {

                it('Responds with a single article object when passed a valid article ID', () => {
                  return request
                    .get('/api/articles/1')
                    .expect(200)
                    .then(({ body }) => {
                      expect(body.article).to.be.an('array');
                      expect(body.article.length).to.eql(1);
                      expect(body.article[0]).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count')
                    });
                });

              });

              describe('Status 404 - Not Found', () => {

                it('Should respond with 404 and error message if passed invalid article ID', () => {
                  return request
                    .get('/api/articles/1000000')
                    .expect(404)
                    .then(({ body }) => {
                      expect(body.msg).to.eql('No articles found')

                    });

                });

              });

              describe('Status 400 - Bad Request', () => {

                it('Should respond with 400 and error message if passed invalid article ID', () => {
                  return request
                    .get('/api/articles/a')
                    .expect(400)
                    .then(({ body }) => {
                      expect(body.msg).to.eql('Invalid article ID')
                    });
                });

              });

            });

          });

        });

      });


    });


  });


});


