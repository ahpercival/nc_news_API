const articlesRouter = require('express').Router();
const {
    getAllArticles,
    getArticleById,
    patchVoteByArticleId,
    getArticleCommentsById,
    postNewComment
} = require('../controllers/articleController')


articlesRouter
    .route('/')
    .get(getAllArticles)
//.all(methodNotAllowed*) * create 405 error function & require in

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchVoteByArticleId)

articlesRouter
    .route('/:article_id/comments')
    .get(getArticleCommentsById)
    .post(postNewComment)

module.exports = articlesRouter