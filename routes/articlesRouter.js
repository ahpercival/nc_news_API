const articlesRouter = require('express').Router();
const { getAllArticles, getArticleById } = require('../controllers/articleController')


articlesRouter
    .route('/')
    .get(getAllArticles)

articlesRouter
    .route('/:article_id')
    .get(getArticleById)

module.exports = articlesRouter