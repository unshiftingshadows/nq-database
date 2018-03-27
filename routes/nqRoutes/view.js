const config = require('../../nq_config.js')
const firebase = require('../../firebase.js').nq
const ObjectId = require('mongoose').Types.ObjectId

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
const UserData = require('../../models/nqModels/UserData.js')
const Topic = require('../../models/nqModels/Topic.js')

var mediaList = {
    'book': Book,
    'movie': Movie,
    'image': Image,
    'video': Video,
    'article': Article,
    'note': Note,
    'document': Doc,
    'discourse': Discourse,
    'composition': Composition,
    'topic': Topic
}

module.exports = function (req, res) {
    console.log('type', req.body.type)
    console.log('id', req.body.id)
    var token = req.body.token

    firebase.verifyID(token)
        .then(function(decodedToken) {
            var type = req.body.type
            var id = req.body.id
            console.log('type', type)
            console.log('id', id)
            if (config.mediaTypes.includes(type)) {
                mediaList[type].findOne({ _id: req.body.id }).select('-users -allTags').exec(function (err, item) {
                    if (err) console.log(err.message)
                    if (type === 'note' || type === 'topic') {
                        res.send({
                            resource: item
                        })
                    } else {
                        UserData.findOne({ uid: decodedToken.uid, resource: ObjectId(id) }).exec(function (err, data) {
                            console.log('data', data)
                            if (data !== null) {
                                item.userData = data
                            } else {
                                console.log('add empty object')
                                data = {
                                    uid: decodedToken.uid,
                                    resource: id,
                                    notes: '',
                                    tags: [],
                                    rating: 0,
                                    status: 'new'
                                }
                            }
                            console.log(type, item)
                            res.send({
                                resource: item,
                                userData: data
                            })
                        })
                    }
                })
            } else {
                console.log('error with type')
                res.status(400).send('Invalid type')
            }
        })
        .catch(function(err) {
            console.log('error with token')
            res.status(400).send('Invalid user token')
        })
}