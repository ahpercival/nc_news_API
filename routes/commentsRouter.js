const commentsRouter = require('express').Router();
const patchVoteByCommentId = require('../controllers/commentController')

commentsRouter
    .route('/:comment_id')
    .patch(patchVoteByCommentId)

module.exports = commentsRouter