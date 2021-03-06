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

// const SermonOther = require('../../models/builderModels/models-other/Sermon.js')
// const LessonOther = require('../../models/builderModels/models-other/Lesson.js')

const SeriesReal = require('../../models/builderModels/Series.js')
const LessonReal = require('../../models/builderModels/Lesson.js')
const DevoReal = require('../../models/builderModels/Devo.js')

const mediaType = {
    // 'osermon': SermonOther,
    // 'olesson': LessonOther,
    'series': SeriesReal,
    'lesson': LessonReal,
    'devo': DevoReal
}

function newType (type, data) {
    switch (type) {
        case 'lesson':
            return new LessonReal({lessonid: data})
        default:
            return false
    }
}

module.exports = function (req, res) {
    console.log('--builder resources run--')
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
                        case 'series':
                            query.seriesid = id
                            break
                        case 'lesson':
                            query.lessonid = id
                            break
                        case 'devo':
                            query.devoid = id
                            break
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
                                var obj = newType(type, id)
                                obj.selection = newSelection._id
                                obj.save(function (err, newLesson) {
                                    if (err) {
                                        console.log('content not added for new resources', err)
                                    } else {
                                        res.send(newLesson)
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