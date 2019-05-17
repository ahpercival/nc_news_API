const connection = require('../db/connection')

const updateVoteByCommentId = (comment_id, inc_votes = 0) => {
    return connection('comments')
        .where('comments.comment_id', '=', comment_id)
        .increment('votes', inc_votes)
        .returning('*')
        .then(([value]) => {
            const comment = { comment: value }
            return comment
        })
}

const removeCommentById = (comment_id) => {
    return connection('comments')
        .where('comments.comment_id', '=', comment_id)
        .del()
}

module.exports = { updateVoteByCommentId, removeCommentById }