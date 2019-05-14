const articlesRouter = require('express').Router();
const { getAllArticles, getArticleById, patchVoteByArticleById } = require('../controllers/articleController')


articlesRouter
    .route('/')
    .get(getAllArticles)

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchVoteByArticleById)

module.exports = articlesRouter