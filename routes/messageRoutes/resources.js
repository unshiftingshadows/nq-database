const config = require('../../real_config.js')
const firebase = require('../../firebase.js').real

// Import media types
const Book = require('../../models/nqModels/Book.js')
const Movie = require('../../models/nqModels/Movie.js')
const Image = require('../../models/nqModels/Image.js')
const Video = require('../../models/nqModels/Video.js')
const Article = require('../../models/nqModels/Article.js')
const Note = require('../../models/nqModels/Note.js')
const Doc = require('../../models/nqModels/Document.js')
const Discourse = require('../../models/nqModels/Discourse.js')
const Composition = require('../../models/nqModels/Composition.js')
const Quote = require('../../models/nqModels/Quote.js')
const Outline = require('../../models/nqModels/Outline.js')
const Idea = require('../../models/nqModels/Idea.js')
const Illustration = require('../../models/nqModels/Illustration.js')

const Topic = require('../../models/nqModels/Topic.js')
const Selection = require('../../models/nqModels/Selection.js')

const SermonOther = require('../../models/messageModels/Sermon.js')
const LessonOther = require('../../models/messageModels/Lesson.js')

// const SeriesReal = require('../../models/builderModels/models-real/Series.js')
// const LessonReal = require('../../models/builderModels/models-real/Lesson.js')
// const DevoReal = require('../../models/builderModels/Devo.js')

const mediaType = {
    'sermon': SermonOther,
    'lesson': LessonOther
    // 'rseries': SeriesReal,
    // 'rlesson': LessonReal,
    // 'rdevo': DevoReal
}

module.exports = function (req, res) {
    console.log('--message resources run--')
    console.log('type', req.body.type)
    console.log('id', req.body.id)
    console.log('action', req.body.action)
    console.log('resourceid', req.body.resource.id)
    console.log('resourceType', req.body.resource.type)
    var token = req.body.token
    
    firebase.verifyID(token)
        .then(function(decodedToken) {
            var type = req.body.type
            var id = req.body.id
            var action = req.body.action
            var resourceid = req.body.resource.id
            var resourceType = req.body.resource.type
            console.log('uid', decodedToken.uid)
            if (Object.keys(mediaType).includes(type)) {
                var query = {}
                    switch (type) {
                        case 'sermon':
                        case 'lesson':
                            query._id = id
                            break
                        // case 'rseries':
                        //     query.seriesid = id
                        //     break
                        // case 'rlesson':
                        //     query.lessonid = id
                        //     break
                        // case 'rdevo':
                        //     query.devoid = id
                        //     break
                    }
                if (action === 'list') {
                    mediaType[type].findOne(query).populate({ path: 'research.media', model: Topic, populate: { path: 'resources.media', populate: { path: 'mediaid', model: 'mediaType', select: 'title author thumbURL' } } }).populate({ path: 'selection', model: Selection, populate: { path: 'resources.media', populate: { path: 'mediaid', select: 'title author thumbURL' } } }).exec(function (err, items) {
                        if (err) {
                            console.log('resources error', err)
                            res.status(400).send('Resources failed')
                            return
                        }
                        if (items === null) {
                            console.log('no resource container -- making a new one')
                            var coll = new Selection({})
                            coll.save(function (err, newSelection) {
                                mediaType[type].updateOne({ _id: id }, { selection: newSelection._id }, function (err, updated) {
                                    if (err) {
                                        console.log('content not updated for new resources', err)
                                    } else {
                                        res.send(updated)
                                    }
                                })
                            })
                        } else {
                            console.log('resource items', items)
                            res.send(items)
                        }
                    })
                } else if (action === 'add') {
                    mediaType[type].findOne(query).exec(function (err, item) {
                        Selection.findOneAndUpdate({ _id: item.selection }, { $addToSet: { resources: { media: resourceid, type: resourceType } } }, (err, ret) => {
                            console.log(err)
                            if (err) res.status(400).send('Add resource failed')
                            console.log(ret)
                            res.send(ret)
                        })
                    })
                } else if (action === 'remove') {
                    mediaType[type].findOne(query).exec(function (err, item) {
                        Selection.findOneAndUpdate({ _id: item.selection }, { $pull: { resource: { media: resourceid } } }, (err, ret) => {
                            console.log(err)
                            if (err) res.status(400).send('Remove resource failed')
                            console.log(ret)
                            res.send(ret)
                        })
                    })
                }
            } else {
                console.log('something went wrong - resources')
            }
        })
}