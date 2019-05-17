const { updateVoteByCommentId, removeCommentById } = require('../model/commentModel')

const patchVoteByCommentId = (req, res, next) => {
    const { comment_id } = req.params
    const { inc_votes } = req.body
    updateVoteByCommentId(comment_id, inc_votes)
        .then((comment) => {
            if (!comment.comment) { return next({ code: 4042 }) }
            res.status(200).send(comment)
        })
        .catch(next)
}

const deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params
    removeCommentById(comment_id)
        .then((result) => {
            if (!result) { return next({ code: 4042 }) }
            res.status(204).send()
        })
        .catch(next)
}

module.exports = { patchVoteByCommentId, deleteCommentById }