const articlesRouter = require('express').Router();
const getAllArticles = require('../controllers/articleController')


articlesRouter
    .route('/')
    .get(getAllArticles)

module.exports = articlesRouter