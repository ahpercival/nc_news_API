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
                      expect(body.updatedArticle).to.be.an('array');
                      expect(body.updatedArticle.length).to.eql(1);
                      expect(body.updatedArticle[0]).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes')
                      expect(body.updatedArticle[0].votes).to.eql(101)
                    });
                });

                it('Should decrement vote by taking vote object and responding with updated article', () => {
                  const newVote = -1
                  return request
                    .patch('/api/articles/1')
                    .send({ inc_votes: newVote })
                    .expect(200)
                    .then(({ body }) => {
                      expect(body.updatedArticle).to.be.an('array');
                      expect(body.updatedArticle.length).to.eql(1);
                      expect(body.updatedArticle[0]).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes')
                      expect(body.updatedArticle[0].votes).to.eql(99)
                    });
                });

                it('Should not increment/decrement vote if object key is invalid', () => {
                  const newVote = 100
                  return request
                    .patch('/api/articles/1')
                    .send({ incorrect_key: newVote })
                    .expect(200)
                    .then(({ body }) => {
                      expect(body.updatedArticle).to.be.an('array');
                      expect(body.updatedArticle.length).to.eql(1);
                      expect(body.updatedArticle[0]).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes')
                      expect(body.updatedArticle[0].votes).to.eql(100)
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


                });

                describe('Status 404 - Not Found', () => {
                  it('Should respond with 404 and error message if article ID does not exist', () => {
                    return request
                      .get('/api/articles/1000/comments')
                      .expect(404)
                      .then(({ body }) => {
                        expect(body.msg).to.eql('No comments found')
                      })
                  })

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

                describe('Status 200 - OK', () => {

                  it('Responds with new comment when passed object with username & body properties', () => {
                    const newComment = { username: 'butter_bridge', body: 'hello' }
                    const articleID = 1
                    return request
                      .post(`/api/articles/${articleID}/comments`)
                      .send(newComment)
                      .expect(200)
                      .then(({ body }) => {
                        expect(body.newComment).to.be.an('array')
                        expect(body.newComment[0]).to.contain.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body')
                        expect(body.newComment[0].author).to.eql('butter_bridge')
                        expect(body.newComment[0].body).to.eql('hello')
                        expect(body.newComment[0].article_id).to.eql(articleID)
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
                        expect(body.msg).to.eql('Unable to post comment')
                      })
                  });

                  it("Should respond with 400 and error message if article doesn't exist", () => {
                    const newComment = { username: 'butter_bridge', body: 'hello' }
                    const articleID = 10000
                    return request
                      .post(`/api/articles/${articleID}/comments`)
                      .send(newComment)
                      .expect(400)
                      .then(({ body }) => {
                        expect(body.msg).to.eql('Unable to post comment')
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
                        expect(body.msg).to.eql('Missing information - please enter valid username & comment')
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
                        expect(body.msg).to.eql('Missing information - please enter valid username & comment')
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

              });

            });

          });


        });

      });


    });

    describe('THE COMMENTS ENDPOINT', () => {

      describe('/comments', () => {

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
                    expect(body.updatedComment).to.be.an('array');
                    expect(body.updatedComment.length).to.eql(1);
                    expect(body.updatedComment[0]).to.contain.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body')
                    expect(body.updatedComment[0].votes).to.eql(17)
                  });
              });

              it('Should decrement vote by taking vote object and responding with updated comment', () => {
                const newVote = -1
                return request
                  .patch('/api/comments/1')
                  .send({ inc_votes: newVote })
                  .expect(200)
                  .then(({ body }) => {
                    expect(body.updatedComment).to.be.an('array');
                    expect(body.updatedComment.length).to.eql(1);
                    expect(body.updatedComment[0]).to.contain.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body')
                    expect(body.updatedComment[0].votes).to.eql(15)
                  });
              });

              it('Should return comment with unchanged vote if body key is invalid', () => {
                const newVote = 1
                return request
                  .patch('/api/comments/1')
                  .send({ invalid_key: newVote })
                  .expect(200)
                  .then(({ body }) => {
                    expect(body.updatedComment).to.be.an('array');
                    expect(body.updatedComment.length).to.eql(1);
                    expect(body.updatedComment[0]).to.contain.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body')
                    expect(body.updatedComment[0].votes).to.eql(16)
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

              it('Should return 400 and error message if passed invalid comment ID', () => {
                const newVote = 1
                return request
                  .patch('/api/comments/100000')
                  .send({ inc_votes: newVote })
                  .expect(400)
                  .then(({ body }) => {
                    expect(body.msg).to.eql('Comment not found')
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
              });

            });

          });

        });

      });


    });

    describe('THE USERS ENDPOINT', () => {

      describe('/users', () => {

        describe('/:username', () => {

          describe('GET Request', () => {

            describe('Status 200 - OK', () => {

              it('Responds with a user object which should have username, avatar_url & name properties', () => {
                return request
                  .get('/api/users/butter_bridge')
                  .expect(200)
                  .then(({ body }) => {
                    expect(body.user).to.be.an('array');
                    expect(body.user[0]).to.contain.keys('username', 'avatar_url', 'name')
                  });
              });

            });

          });

        });

      });

    });

  });


});


