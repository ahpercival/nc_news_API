const fetchTopicData = require('../model/topicModel')

const getTopicData = (req, res, next) => {

    fetchTopicData()
        .then(topics => {
            res.status(200).send({ topics })
        })
        .catch(next)
}

module.exports = getTopicData