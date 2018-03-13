const config = require('../nq_config.js')
const firebase = require('../firebase.js')

// Import media types
const Book = require('../models/Book.js')
const Movie = require('../models/Movie.js')
const Image = require('../models/Image.js')
const Video = require('../models/Video.js')
const Article = require('../models/Article.js')
const Note = require('../models/Note.js')
const Quote = require('../models/Quote.js')
const Topic = require('../models/Topic.js')

var mediaList = {
    'books': Book,
    'movies': Movie,
    'images': Image,
    'videos': Video,
    'articles': Article,
    'notes': Note,
    'quotes': Quote,
    'topics': Topic
}

module.exports = function (req, res) {
    console.log('type', req.body.type)
    var token = req.body.token

    firebase.verifyID(token)
        .then(function(decodedToken) {
            var type = req.body.type
            console.log('uid', decodedToken.uid)
            if (config.mediaTypes.includes(type.slice(0, -1))) {
                if (type == 'quotes') {
                    // TODO: Add logic for populating quotes before sending
                    // To be used for pulling all quotes at once -- probably not a regular thing to do
                } else if (type == 'notes') {
                    Note.find({}).where('user', decodedToken.uid).exec(function (err, items) {
                        if (err) console.log(err.message)
                        console.log(items)
                        res.send(items)
                    })
                } else {
                    mediaList[type].find({}).$where('this.users.includes(\"' + decodedToken.uid + '\")').exec(function (err, items) {
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