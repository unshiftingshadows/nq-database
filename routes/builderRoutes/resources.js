const config = require('../../real_config.js')
const firebase = require('../../firebase.js').builder

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

const LessonOther = require('../../models/builderModels/models-other/Lesson.js')

const getMedia = {
    'book': Book,

}

module.exports = function (req, res) {
    console.log('type', req.body.type)
    console.log('id', req.body.id)
    var token = req.body.token
    
    firebase.verifyID(token)
        .then(function(decodedToken) {
            var type = req.body.type
            var id = req.body.id
            console.log('uid', decodedToken.uid)
            if (type === 'olesson') {
                LessonOther.findOne({ _id: id }).populate({ path: 'research.media', model: Topic, populate: { path: 'resources.media', model: 'resources.type', populate: { path: 'mediaid', model: 'mediaType' } } }).exec(function (err, items) {
                    if (err) console.log(err)
                    console.log('new')
                    console.log(items)
                    res.send(items)
                })
            } else {
                console.log('something went wrong')
            }
        })
}