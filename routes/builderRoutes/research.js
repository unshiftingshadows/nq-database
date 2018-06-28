const Schema = require('mongoose').Schema
const MTypes = require('mongoose').Types

const config = require('../../real_config.js')
const firebase = require('../../firebase.js').builder

// Import media types
const SermonOther = require('../../models/builderModels/models-other/Sermon.js')
const LessonOther = require('../../models/builderModels/models-other/Lesson.js')
const LessonReal = require('../../models/builderModels/models-real/Lesson.js')
const DevoReal = require('../../models/builderModels/models-real/Devo.js')

const Topic = require('../../models/nqModels/Topic.js')
const Selection = require('../../models/nqModels/Selection.js')

const mediaType = {
    'osermon': SermonOther,
    'olesson': LessonOther,
    'rlesson': LessonReal,
    'rdevo': DevoReal
}

const researchType = {
    'topic': Topic
}

module.exports = function (req, res) {
    console.log('--builder research run--')
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
                    if (err) {
                        console.log('Media failed', err)
                        res.status(400).send('Add research failed')
                    } else {
                        if (type.charAt(0) === 'r') {
                            researchType[research.type].findOne({ _id: research.id }, (err, researchTopic) => {
                                if (err) {
                                    console.log('Research failed', err)
                                    res.status(400).send('Add research resources failed')
                                } else {
                                    Selection.findOneAndUpdate({ _id: ret.selection }, { $addToSet: { resources: { $each: researchTopic.resources } } }, (err, ret) => {
                                        if (err) {
                                            console.log('Selection failed', err)
                                            res.status(400).send('Append to selection failed')
                                        } else {
                                            console.log(ret)
                                            res.send(ret)
                                        }
                                    })
                                }
                            })
                        } else {
                            console.log(ret)
                            res.send(ret)
                        }
                    }
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