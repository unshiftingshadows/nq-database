const config = require('../../nq_config.js')
const firebase = require('../../firebase.js').nq
const mongoose = require('mongoose')

var ObjectId = mongoose.Types.ObjectId

// Import media types
const Book = require('../../models/nqModels/Book.js')
const Movie = require('../../models/nqModels/Movie.js')
const Image = require('../../models/nqModels/Image.js')
const Video = require('../../models/nqModels/Video.js')
const Article = require('../../models/nqModels/Article.js')
const Note = require('../../models/nqModels/Note.js')
const Quote = require('../../models/nqModels/Quote.js')
const Outline = require('../../models/nqModels/Outline.js')
const Idea = require('../../models/nqModels/Idea.js')

const Topic = require('../../models/nqModels/Topic.js')

// var researchType = {
//     'topic': Topic
// }

module.exports = function (req, res) {
    console.log('type', req.body.type)
    console.log('id', req.body.id)
    var token = req.body.token

    firebase.verifyID(token)
        .then(function(decodedToken) {
            var type = req.body.type
            var id = req.body.id
            Topic.findOne({ _id: id }).populate({ path: 'resources.media', populate: { path: 'mediaid', select: 'title author thumbURL' } }).select('resources').exec(function (err, topic) {
                if (err) console.log(err.message)
                console.log('topic res', topic)
                res.send(topic)
                // console.log('quotes', quotes.length)
                // res.send(quotes)
            })
        })
        .catch(function(err) {
            console.log('error with token')
            res.status(400).send('Invalid user token')
        })
}