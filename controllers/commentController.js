const { updateVoteByCommentId, removeCommentById } = require('../model/commentModel')

const patchVoteByCommentId = (req, res, next) => {
    const { comment_id } = req.params
    const { inc_votes } = req.body
    updateVoteByCommentId(comment_id, inc_votes)
        .then(updatedComment => {
            if (!updatedComment.length) { return next({ code: 4004 }) }
            res.status(200).send({ updatedComment })
        })
        .catch(next)
}

const deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params
    removeCommentById(comment_id)
        .then(() => {
            res.status(204).send()
        })
        .catch(next)
}

module.exports = { patchVoteByCommentId, deleteCommentById }