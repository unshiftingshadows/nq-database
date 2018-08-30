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
const UserData = require('../../models/nqModels/UserData.js')

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
    console.log('filter', req.body.filter)
    console.log('sort', req.body.sort)
    var token = req.body.token

    firebase.verifyID(token)
        .then(function(decodedToken) {
            var type = req.body.type
            var filter = req.body.filter
            console.log('uid', decodedToken.uid)
            if (config.mediaTypes.includes(type)) {
                // Set up initial query with the media type
                var query = mediaList[type].find({}).populate({ path: 'userData', model: UserData })
                // Query based on user and select fields
                if (type == 'quote') {
                    // TODO: Add logic for populating quotes before sending
                    // To be used for pulling all quotes at once -- probably not a regular thing to do
                } else if (type === 'note') {
                    query = query
                        .where('user', decodedToken.uid)
                        .select('author dateAdded dateModified text thumbURL title type userData users')
                } else {
                    query = query
                        .$where('this.users.includes(\"' + decodedToken.uid + '\")')
                        .select('author dateAdded dateModified source thumbURL title type userData users')
                }
                // Execute the query
                query.exec(function (err, allItems) {
                    console.log('something')
                    if (err) console.log(err.message)
                    var items = allItems
                    console.log(items)
                    // If filter is given, add to query
                    if (filter !== {}) {
                        if (filter.newOnly) {
                            console.log('filtering')
                            items = allItems.filter((item) => { return (item.userData === undefined || item.userData.get(decodedToken.uid) === undefined || item.userData.get(decodedToken.uid).status === 'new') })
                        }
                        console.log(items.length)
                        res.send(items)
                    } else {
                        res.send(items)
                    }
                })
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