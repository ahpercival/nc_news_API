const articlesRouter = require('express').Router();
const { getAllArticles, getArticleById, patchVoteByArticleById, getArticleCommentsById } = require('../controllers/articleController')


articlesRouter
    .route('/')
    .get(getAllArticles)

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchVoteByArticleById)

articlesRouter
    .route('/:article_id/comments')
    .get(getArticleCommentsById)

module.exports = articlesRouter