process.env.NODE_ENV = 'test';

const chai = require('chai')
const { expect } = chai;
const supertest = require('supertest');
const app = require('../app');
const request = supertest(app)
const connection = require('../db/connection');
const chaiSorted = require('chai-sorted')
const endpoints = require('../endpoints.json')

chai.use(chaiSorted)

describe('THE API ENDPOINT', () => {
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
              expect(body).to.eql(endpoints);
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

    describe('UNAUTHORISED Request', () => {

      describe('Status 405 - Method Not Allowed', () => {

        it('Responds with 405 and error message', () => {
          return request
            .put('/api')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.eql('Method Not Allowed');
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

        describe('POST Request', () => {

          describe('Status 201 - Created', () => {

            it('Responds with new topic when passed object with slug & description properties', () => {
              const newTopic = { slug: 'test topic', description: 'hello' }

              return request
                .post('/api/topics')
                .send(newTopic)
                .expect(201)
                .then(({ body }) => {
                  expect(body).to.be.an('object');
                  expect(body.topic).to.contain.keys('slug', 'description')
                });
            });

          });

          describe('Status 400 - Bad Request', () => {

            it('Responds with 400 and error message when not passed any properties', () => {
              const newTopic = { slug: '', description: '' }
              return request
                .post('/api/topics')
                .send(newTopic)
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.eql('No details provided');
                });
            });

            it('Responds with 400 and error message when missing key items', () => {
              const newTopic = {}
              return request
                .post('/api/topics')
                .send(newTopic)
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.eql('Missing information - please enter valid details');
                });
            });

          });

        });

        describe('UNAUTHORISED Request', () => {

          describe('Status 405 - Method Not Allowed', () => {

            it('Responds with 405 and error message', () => {
              return request
                .put('/api/topics')
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).to.eql('Method Not Allowed');
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
                  expect(body.total_count).to.be.a('string')
                  expect(body.total_count).to.eql('12')
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

            describe('PAGINATION', () => {

              it('Page 1 should return 10 articles by default', () => {
                return request
                  .get('/api/articles')
                  .expect(200)
                  .then(({ body }) => {
                    expect(body.articles.length).to.eql(10)
                  });
              });

              it('Page 1 should return number of articles specified in query', () => {
                return request
                  .get('/api/articles?limit=3')
                  .expect(200)
                  .then(({ body }) => {
                    expect(body.articles.length).to.eql(3)
                    expect(body.articles[0].title).to.eql('Living in the shadow of a great man')
                    expect(body.articles[1].title).to.eql('Sony Vaio; or, The Laptop')
                    expect(body.articles[2].title).to.eql('Eight pug gifs that remind me of mitch')
                  });
              });

              it('Page 2 should return the next set of articles based on the limit/offset', () => {
                return request
                  .get('/api/articles?limit=3&p=2')
                  .expect(200)
                  .then(({ body }) => {
                    expect(body.articles.length).to.eql(3)
                    expect(body.articles[0].title).to.eql('Student SUES Mitch!')
                    expect(body.articles[1].title).to.eql('UNCOVERED: catspiracy to bring down democracy')
                    expect(body.articles[2].title).to.eql('A')
                  });
              });

            });

          });
        });

        describe('POST Request', () => {

          describe('Status 201 - Created', () => {

            it('Should post/respond with new article when passed article object', () => {
              const newArticle = { author: 'butter_bridge', title: 'New Article', body: 'hello', topic: 'mitch' }
              return request
                .post('/api/articles')
                .send(newArticle)
                .expect(201)
                .then(({ body }) => {
                  expect(body).to.be.an('object');
                  expect(body.article).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes')
                });
            });

          });

          describe('Status 400 - Bad Request', () => {

            it('Responds with 400 and error message when not passed any properties', () => {
              const newArticle = { author: '', title: '', body: '', topic: '' }
              return request
                .post('/api/articles')
                .send(newArticle)
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.eql('Unable to post content');
                });
            });

            it('Responds with 400 and error message when missing key items', () => {
              const newArticle = {}
              return request
                .post('/api/articles')
                .send(newArticle)
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.eql('Missing information - please enter valid details');
                });
            });

          });

        })

        describe('UNAUTHORISED Request', () => {

          describe('Status 405 - Method Not Allowed', () => {

            it('Responds with 405 and error message', () => {
              return request
                .put('/api/articles/')
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).to.eql('Method Not Allowed');
                });
            });

          });

        });

        describe('/?', () => {
          describe('GET Request', () => {
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
                    expect(body.total_count).to.be.a('string')
                    expect(body.total_count).to.eql('3')
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
                    expect(body.total_count).to.be.a('string')
                    expect(body.total_count).to.eql('11')
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
          })

          describe('UNAUTHORISED Request', () => {

            describe('Status 405 - Method Not Allowed', () => {

              it('Responds with 405 and error message', () => {
                return request
                  .put('/api/articles/?topic=a')
                  .expect(405)
                  .then(({ body }) => {
                    expect(body.msg).to.eql('Method Not Allowed');
                  });
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
                    expect(body).to.be.an('object');
                    expect(body.article).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count')
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
                    expect(body.msg).to.eql('Invalid character entered')
                  });
              });

            });

          });

          describe('PATCH Request', () => {

            describe('Status 200 - OK', () => {

              it('Should increment vote by taking vote object and responding with updated article', () => {
                const newVote = 1
                return request
                  .patch('/api/articles/1')
                  .send({ inc_votes: newVote })
                  .expect(200)
                  .then(({ body }) => {
                    expect(body).to.be.an('object')
                    expect(body).to.contain.keys('article')
                    expect(body.article).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes')
                    expect(body.article.votes).to.eql(101)
                  });
              });

              it('Should decrement vote by taking vote object and responding with updated article', () => {
                const newVote = -1
                return request
                  .patch('/api/articles/1')
                  .send({ inc_votes: newVote })
                  .expect(200)
                  .then(({ body }) => {
                    expect(body).to.be.an('object')
                    expect(body).to.contain.keys('article')
                    expect(body.article).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes')
                    expect(body.article.votes).to.eql(99)
                  });
              });

              it('Should not increment/decrement vote if object key is invalid', () => {
                const newVote = 100
                return request
                  .patch('/api/articles/1')
                  .send({ incorrect_key: newVote })
                  .expect(200)
                  .then(({ body }) => {
                    expect(body).to.be.an('object')
                    expect(body).to.contain.keys('article')
                    expect(body.article).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes')
                    expect(body.article.votes).to.eql(100)
                  });
              });


            });

            describe('Status 400 - Bad Request', () => {

              it('Should respond with 400 and error message if passed invalid article ID', () => {
                const newVote = 1
                return request
                  .patch('/api/articles/10000')
                  .send({ inc_votes: newVote })
                  .expect(400)
                  .then(({ body }) => {
                    expect(body.msg).to.eql('Article does not exist')
                  });
              });

              it('Should respond with 400 and error message if passed invalid object value', () => {
                const newVote = 'a'
                return request
                  .patch('/api/articles/1')
                  .send({ inc_votes: newVote })
                  .expect(400)
                  .then(({ body }) => {
                    expect(body.msg).to.eql('Invalid character entered')
                  });
              });

            });

          });

          describe('DELETE Request', () => {

            describe('Status 204 - No Content', () => {
              it('Should delete the given article by article_id & respond with status 204 and no content', () => {
                return request
                  .delete('/api/articles/1')
                  .expect(204)
              });

            });

            describe('Status 400 - Bad Request', () => {

              it('Should return 400 and no content if article ID is invalid', () => {
                return request
                  .delete('/api/articles/invalid')
                  .expect(400)
                  .then(({ body }) => {
                    expect(body.msg).to.eql('Invalid character entered')
                  });
              });

            });

            describe('Status 404 - Not Found', () => {

              it("Should return 404 and no content if article ID doesn't exist", () => {
                return request
                  .delete('/api/articles/1000')
                  .expect(404)
                  .then(({ body }) => {
                    expect(body.msg).to.eql('No articles found')
                  });
              });

            });

          });

          describe('UNAUTHORISED Request', () => {

            describe('Status 405 - Method Not Allowed', () => {

              it('Responds with 405 and error message', () => {
                return request
                  .put('/api/articles/1')
                  .expect(405)
                  .then(({ body }) => {
                    expect(body.msg).to.eql('Method Not Allowed');
                  });
              });

            });

          });

          describe('/comments', () => {

            describe('GET Request', () => {

              describe('Status 200 - OK', () => {

                it('Responds with an array of comments for the given article_id', () => {
                  return request
                    .get('/api/articles/1/comments')
                    .expect(200)
                    .then(({ body }) => {
                      expect(body.comments).to.be.an('array');
                      body.comments.forEach(comment => {
                        expect(comment).to.contain.keys('comment_id', 'votes', 'created_at', 'author', 'body')
                      })
                    });
                });

                it('Comments should be sorted by created_at in descending order by default', () => {
                  return request
                    .get('/api/articles/1/comments')
                    .expect(200)
                    .then(({ body }) => {
                      expect(body.comments).to.be.descendingBy('created_at')
                    });
                });

                it('Should sort articles by any valid column passed in query', () => {
                  return request
                    .get('/api/articles/1/comments?sort_by=author')
                    .expect(200)
                    .then(({ body }) => {
                      expect(body.comments).to.be.descendingBy('author')
                    });
                });

                it('Should order articles in ascending order when specified in query', () => {
                  return request
                    .get('/api/articles/1/comments?order=asc')
                    .expect(200)
                    .then(({ body }) => {
                      expect(body.comments).to.be.ascendingBy('created_at')
                    });
                });

                it('Should return article comments sorted by default when passed query with invalid query key', () => {
                  return request
                    .get('/api/articles/1/comments?invalid_query=author')
                    .expect(200)
                    .then(({ body }) => {
                      expect(body.comments).to.be.an('array');
                      body.comments.forEach(comment => {
                        expect(comment).to.contain.keys('comment_id', 'votes', 'created_at', 'author', 'body')
                      })
                    });
                });

                describe('PAGINATION', () => {

                  it('Page 1 should return 10 articles by default', () => {
                    return request
                      .get('/api/articles/1/comments')
                      .expect(200)
                      .then(({ body }) => {
                        expect(body.comments.length).to.eql(10)
                      });
                  });

                  it('Page 1 should return number of articles specified in query', () => {
                    return request
                      .get('/api/articles/1/comments?limit=3')
                      .expect(200)
                      .then(({ body }) => {
                        expect(body.comments.length).to.eql(3)
                        expect(body.comments[0].comment_id).to.eql(2)
                        expect(body.comments[1].comment_id).to.eql(3)
                        expect(body.comments[2].comment_id).to.eql(4)
                      });
                  });

                  it('Page 2 should return the next set of articles based on the limit/offset', () => {
                    return request
                      .get('/api/articles/1/comments?limit=3&p=2')
                      .expect(200)
                      .then(({ body }) => {
                        expect(body.comments.length).to.eql(3)
                        expect(body.comments[0].comment_id).to.eql(5)
                        expect(body.comments[1].comment_id).to.eql(6)
                        expect(body.comments[2].comment_id).to.eql(7)
                      });
                  });

                });

              });

              describe('Status 404 - Not Found', () => {

                it('Should respond with 404 and error message if passed invalid route', () => {
                  return request
                    .get('/api/articles/1/comment')
                    .expect(404)
                    .then(({ body }) => {
                      expect(body.msg).to.eql('Route Not Found')
                    })
                });

              });

              describe('Status 400 - Bad Request', () => {

                it('Should respond with 400 and error message if passed invalid article ID', () => {
                  return request
                    .get('/api/articles/invalid_id/comments')
                    .expect(400)
                    .then(({ body }) => {
                      expect(body.msg).to.eql('Invalid character entered')
                    })
                });

                it('Should respond with 400 and error message when passed invalid column', () => {
                  return request
                    .get('/api/articles/1/comments?sort_by=invalid_column')
                    .expect(400)
                    .then(({ body }) => {
                      expect(body.msg).to.eql('Unable to sort - Invalid column')
                    });
                });

              });

            });

            describe('POST Request', () => {

              describe('Status 201 - Created', () => {

                it('Responds with new comment when passed object with username & body properties', () => {
                  const newComment = { username: 'butter_bridge', body: 'hello' }
                  const articleID = 1
                  return request
                    .post(`/api/articles/${articleID}/comments`)
                    .send(newComment)
                    .expect(201)
                    .then(({ body }) => {
                      expect(body).to.be.an('object')
                      expect(body.comment).to.contain.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body')
                      expect(body.comment.author).to.eql('butter_bridge')
                      expect(body.comment.body).to.eql('hello')
                      expect(body.comment.article_id).to.eql(articleID)
                    })
                });

              });

              describe('Status 400 - Bad Request', () => {

                it('Should respond with 400 and error message if user does not exist in user table', () => {
                  const newComment = { username: 'Adrian', body: 'hello' }
                  const articleID = 1
                  return request
                    .post(`/api/articles/${articleID}/comments`)
                    .send(newComment)
                    .expect(400)
                    .then(({ body }) => {
                      expect(body.msg).to.eql('Unable to post content')
                    })
                });

                it("Should respond with 400 and error message if comment does not have username", () => {
                  const newComment = { username: 'butter_bridge' }
                  const articleID = 1
                  return request
                    .post(`/api/articles/${articleID}/comments`)
                    .send(newComment)
                    .expect(400)
                    .then(({ body }) => {
                      expect(body.msg).to.eql('Missing information - please enter valid details')
                    })
                });

                it("Should respond with 400 and error message if comment does not have body", () => {
                  const newComment = { body: 'hello' }
                  const articleID = 1
                  return request
                    .post(`/api/articles/${articleID}/comments`)
                    .send(newComment)
                    .expect(400)
                    .then(({ body }) => {
                      expect(body.msg).to.eql('Missing information - please enter valid details')
                    })
                });

                it("Should respond with 400 and error message if body is empty", () => {
                  const newComment = { username: 'butter_bridge', body: '' }
                  const articleID = 1
                  return request
                    .post(`/api/articles/${articleID}/comments`)
                    .send(newComment)
                    .expect(400)
                    .then(({ body }) => {
                      expect(body.msg).to.eql('Please include comment')
                    })
                });

              });

              describe('Status 404 - Not Found', () => {

                it("Should respond with 404 and error message if article doesn't exist", () => {
                  const newComment = { username: 'butter_bridge', body: 'hello' }
                  const articleID = 10000
                  return request
                    .post(`/api/articles/${articleID}/comments`)
                    .send(newComment)
                    .expect(404)
                    .then(({ body }) => {
                      expect(body.msg).to.eql('Unable to post content')
                    })
                });

              });

            });

            describe('UNAUTHORISED Request', () => {

              describe('Status 405 - Method Not Allowed', () => {

                it('Responds with 405 and error message', () => {
                  return request
                    .put('/api/articles/1/comments')
                    .expect(405)
                    .then(({ body }) => {
                      expect(body.msg).to.eql('Method Not Allowed');
                    });
                });

              });

            });

          });

        });

        describe('UNAUTHORISED Request', () => {

          describe('Status 405 - Method Not Allowed', () => {

            it('Responds with 405 and error message', () => {
              return request
                .put('/api/articles')
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).to.eql('Method Not Allowed');
                });
            });

          });

        });

      });


    });

    describe('THE COMMENTS ENDPOINT', () => {

      describe('/comments', () => {

        describe('UNAUTHORISED Request', () => {

          describe('Status 405 - Method Not Allowed', () => {

            it('Responds with 405 and error message', () => {
              return request
                .put('/api/comments/')
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).to.eql('Method Not Allowed');
                });
            });

          });

        });

        describe('/:comment_id', () => {

          describe('PATCH Request', () => {

            describe('Status 200 - OK', () => {

              it('Should increment vote by taking vote object and responding with updated comment', () => {
                const newVote = 1
                return request
                  .patch('/api/comments/1')
                  .send({ inc_votes: newVote })
                  .expect(200)
                  .then(({ body }) => {
                    expect(body).to.be.an('object');
                    expect(body.comment).to.contain.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body')
                    expect(body.comment.votes).to.eql(17)
                  });
              });

              it('Should decrement vote by taking vote object and responding with updated comment', () => {
                const newVote = -1
                return request
                  .patch('/api/comments/1')
                  .send({ inc_votes: newVote })
                  .expect(200)
                  .then(({ body }) => {
                    expect(body).to.be.an('object');
                    expect(body.comment).to.contain.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body')
                    expect(body.comment.votes).to.eql(15)
                  });
              });

              it('Should return comment with unchanged vote if body key is invalid', () => {
                const newVote = 1
                return request
                  .patch('/api/comments/1')
                  .send({ invalid_key: newVote })
                  .expect(200)
                  .then(({ body }) => {
                    expect(body).to.be.an('object');
                    expect(body.comment).to.contain.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body')
                    expect(body.comment.votes).to.eql(16)
                  });
              });

            });

            describe('Status 400 - Bad Request', () => {

              it('Should return 400 and error message if passed invalid vote', () => {
                const newVote = 'invalid_vote'
                return request
                  .patch('/api/comments/1')
                  .send({ inc_votes: newVote })
                  .expect(400)
                  .then(({ body }) => {
                    expect(body.msg).to.eql('Invalid character entered')
                  });
              });

            });

            describe('Status 404 - Not Found', () => {

              it('Should return 404 and error message if passed invalid comment ID', () => {
                const newVote = 1
                return request
                  .patch('/api/comments/100000')
                  .send({ inc_votes: newVote })
                  .expect(404)
                  .then(({ body }) => {
                    expect(body.msg).to.eql('No comments found')
                  });
              });

            });

          });

          describe('DELETE Request', () => {

            describe('Status 204 - No Content', () => {

              it('Should delete the given comment by comment_id & respond with status 204 and no content', () => {
                return request
                  .delete('/api/comments/1')
                  .expect(204)
              });

            });

            describe('Status 400 - Bad Request', () => {

              it('Should return 400 and no content if article ID is invalid', () => {
                return request
                  .delete('/api/comments/invalid')
                  .expect(400)
                  .then(({ body }) => {
                    expect(body.msg).to.eql('Invalid character entered')
                  });
              });

            });

            describe('Status 404 - Not Found', () => {

              it("Should return 404 and no content if article ID doesn't exist", () => {
                return request
                  .delete('/api/comments/1000')
                  .expect(404)
                  .then(({ body }) => {
                    expect(body.msg).to.eql('No comments found')
                  });
              });

            });

          });

          describe('UNAUTHORISED Request', () => {

            describe('Status 405 - Method Not Allowed', () => {

              it('Responds with 405 and error message', () => {
                return request
                  .put('/api/comments/1')
                  .expect(405)
                  .then(({ body }) => {
                    expect(body.msg).to.eql('Method Not Allowed');
                  });
              });

            });

          });

        });

      });


    });

    describe('THE USERS ENDPOINT', () => {

      describe('/users', () => {

        describe('POST Request', () => {

          describe('Status 201 - Created', () => {

            it('Responds with new user when passed object with username, name & avatar_url properties', () => {
              const newUser = { username: 'ahpercival', avatar_url: 'https://dyingscene.com/wp-content/uploads/descendents_milo.gif', name: 'Adrian' }
              return request
                .post(`/api/users`)
                .send(newUser)
                .expect(201)
                .then(({ body }) => {
                  expect(body).to.be.an('object');
                  expect(body.user).to.contain.keys('username', 'avatar_url', 'name')
                });
            });

          });

          describe('Status 400 - Bad Request', () => {

            it('Responds with 400 and error message when not passed any properties', () => {
              const newUser = { username: '', avatar_url: '', name: '' }
              return request
                .post(`/api/users`)
                .send(newUser)
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.eql('No details provided');
                });
            });

            it('Responds with 400 and error message when missing key items', () => {
              const newUser = {}
              return request
                .post(`/api/users`)
                .send(newUser)
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.eql('Missing information - please enter valid details');
                });
            });

          });

        });

        describe('GET Request', () => {

          describe('Status 200 - OK', () => {

            it('Should return array of users object', () => {
              return request
                .get('/api/users')
                .expect(200)
                .then(({ body }) => {
                  expect(body.users).to.be.an('array');
                  body.users.forEach(user => {
                    expect(user).to.contain.keys('username', 'avatar_url', 'name')
                  })
                });
            });
          });

        });

        describe('UNAUTHORISED Request', () => {

          describe('Status 405 - Method Not Allowed', () => {

            it('Responds with 405 and error message', () => {
              return request
                .put('/api/users')
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).to.eql('Method Not Allowed');
                });
            });

          });

        });

        describe('/:username', () => {

          describe('GET Request', () => {

            describe('Status 200 - OK', () => {

              it('Responds with a user object which should have username, avatar_url & name properties', () => {
                return request
                  .get('/api/users/butter_bridge')
                  .expect(200)
                  .then(({ body }) => {
                    expect(body.user).to.be.an('object');
                    expect(body.user).to.contain.keys('username', 'avatar_url', 'name')
                  });
              });

            });

            describe('Status 404 - Not Found', () => {

              it('Responds with a user object which should have username, avatar_url & name properties', () => {
                return request
                  .get('/api/users/invalid_username')
                  .expect(404)
                  .then(({ body }) => {
                    expect(body.msg).to.eql('User not found');
                  });

              });
            });

          });

          describe('UNAUTHORISED Request', () => {

            describe('Status 405 - Method Not Allowed', () => {

              it('Responds with 405 and error message', () => {
                return request
                  .put('/api/users/butter_bridge')
                  .expect(405)
                  .then(({ body }) => {
                    expect(body.msg).to.eql('Method Not Allowed');
                  });
              });

            });

          });

        });

      });

    });

  });


});