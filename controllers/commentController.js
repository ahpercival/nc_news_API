const updateVoteByCommentId = require('../model/commentModel')

const patchVoteByCommentId = (req, res, next) => {
    const { comment_id } = req.params
    const { inc_vote_by } = req.body
    updateVoteByCommentId(comment_id, inc_vote_by)
        .then(updatedComment => {
            res.status(200).send({ updatedComment })
        })
        .catch(next)
}

module.exports = patchVoteByCommentId