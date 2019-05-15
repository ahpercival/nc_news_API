const commentsRouter = require('express').Router();
const { patchVoteByCommentId, deleteCommentById } = require('../controllers/commentController')

commentsRouter
    .route('/:comment_id')
    .patch(patchVoteByCommentId)
    .delete(deleteCommentById)

module.exports = commentsRouter