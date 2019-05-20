const commentsRouter = require('express').Router();
const { methodNotAllowed } = require('../errors/index');
const { patchVoteByCommentId, deleteCommentById } = require('../controllers/commentController')

commentsRouter
    .route('/')
    .all(methodNotAllowed);

commentsRouter
    .route('/:comment_id')
    .patch(patchVoteByCommentId)
    .delete(deleteCommentById)
    .all(methodNotAllowed);

module.exports = commentsRouter