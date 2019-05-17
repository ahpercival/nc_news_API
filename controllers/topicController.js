const { fetchTopicData, addNewTopic } = require('../model/topicModel')

const getTopicData = (req, res, next) => {

    fetchTopicData()
        .then(topics => {
            res.status(200).send({ topics })
        })
        .catch(next)
}

const postNewTopic = (req, res, next) => {
    const { slug, description } = req.body
    const newTopic = { slug, description }
    addNewTopic(newTopic)
        .then(([topic]) => {
            if (!topic.slug.length || !topic.description.length) { return next({ code: 4005 }) }
            res.status(201).send({ topic })
        })
        .catch(next)
}

module.exports = { getTopicData, postNewTopic }