const connection = require('../db/connection')

const updateVoteByCommentId = (comment_id, inc_vote_by) => {
    return connection('comments')
        .where('comments.comment_id', '=', comment_id)
        .increment('votes', inc_vote_by)
        .returning('*')
}

module.exports = updateVoteByCommentId