const Schema = require('mongoose').Schema
const MTypes = require('mongoose').Types

const config = require('../../real_config.js')
const firebase = require('../../firebase.js').builder

// Import media types
const LessonOther = require('../../models/builderModels/models-other/Lesson.js')

const Topic = require('../../models/nqModels/Topic.js')

const mediaType = {
    'olesson': LessonOther
}

const researchType = {
    'topic': Topic
}

module.exports = function (req, res) {
    console.log('action', req.body.action)
    console.log('type', req.body.type)
    console.log('id', req.body.id)
    console.log('researchtype', req.body.researchtype)
    console.log('researchid', req.body.researchid)
    var token = req.body.token
    
    firebase.verifyID(token)
        .then(function(decodedToken) {
            console.log('research good!')
            var action = req.body.action
            var type = req.body.type
            var id = req.body.id
            var research = {
                id: req.body.researchid,
                type: req.body.researchtype
            }
            if (action === 'add') {
                mediaType[type].findOneAndUpdate({ _id: id }, { $addToSet: { research: { media: research.id, type: research.type } } }, (err, ret) => {
                    console.log(err)
                    if (err) res.status(400).send('Update failed')
                    console.log(ret)
                    res.send(ret)
                })
            } else if (action === 'remove') {
                mediaType[type].findOneAndUpdate({ _id: id }, { $pull: { research: { media: research.id } } }, (err, ret) => {
                    console.log(err)
                    if (err) res.status(400).send('Update failed')
                    console.log(ret)
                    res.send(ret)
                })
            }
        })
        .catch(function(err) {
            console.log('error with token')
            console.log(err)
            res.status(400).send('Invalid user token')
        })
}