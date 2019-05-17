const articlesRouter = require('express').Router();
const { methodNotAllowed } = require('../errors/index')
const {
    getAllArticles,
    getArticleById,
    patchVoteByArticleId,
    getArticleCommentsById,
    postNewComment,
    postNewArticle,
    deleteArticleById
} = require('../controllers/articleController')


articlesRouter
    .route('/')
    .get(getAllArticles)
    .post(postNewArticle)
    .all(methodNotAllowed)

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchVoteByArticleId)
    .delete(deleteArticleById)
    .all(methodNotAllowed)

articlesRouter
    .route('/:article_id/comments')
    .get(getArticleCommentsById)
    .post(postNewComment)
    .all(methodNotAllowed)

module.exports = articlesRouter