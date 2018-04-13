const config = require('../../nq_config.js')
const firebase = require('../../firebase.js').nq

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
    'quote': Quote,
    'outline': Outline,
    'idea': Idea,
    'illustration': Illustration,
    'topic': Topic
}

module.exports = function (req, res) {
    console.log('type', req.body.type)
    var token = req.body.token

    firebase.verifyID(token)
        .then(function(decodedToken) {
            var type = req.body.type
            console.log('uid', decodedToken.uid)
            if (config.mediaTypes.includes(type)) {
                if (type == 'quote') {
                    // TODO: Add logic for populating quotes before sending
                    // To be used for pulling all quotes at once -- probably not a regular thing to do
                } else if (type == 'note') {
                    Note.find({}).where('user', decodedToken.uid).exec(function (err, items) {
                        if (err) console.log(err.message)
                        console.log(items)
                        res.send(items)
                    })
                } else {
                    mediaList[type].find({}).$where('this.users.includes(\"' + decodedToken.uid + '\")').exec(function (err, items) {
                        console.log('something')
                        if (err) console.log(err.message)
                        console.log(items)
                        res.send(items)
                    })
                }
            } else {
                console.log('error with type')
                res.status(400).send('Invalid type')
            }
        })
        .catch(function(err) {
            console.log('error with token', err)
            res.status(400).send('Invalid user token')
        })
}