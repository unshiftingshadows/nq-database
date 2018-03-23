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
const Outline = require('../models/Outline.js')
const Idea = require('../models/Idea.js')
const Topic = require('../models/Topic.js')
const UserData = require('../models/UserData.js')

var mediaList = {
    'book': Book,
    'movie': Movie,
    'image': Image,
    'video': Video,
    'article': Article,
    'note': Note,
    'quote': Quote,
    'outline': Outline,
    'idea': Idea,
    'topic': Topic
}

module.exports = function (req, res) {
    console.log('type', req.body.type)
    console.log('id', req.body.id)
    console.log('resource data', req.body.data)
    console.log('update user data?', req.body.updateUserData)
    var token = req.body.token

    firebase.verifyID(token)
        .then(function(decodedToken) {
            var type = req.body.type
            var id = req.body.id
            var data = req.body.data
            if (config.mediaTypes.includes(type)) {
                if (!req.body.updateUserData) {
                    mediaList[type].findById(id, function (err, item) {
                        if (err) console.log(err)
                        for (key in data) {
                            item[key] = data[key]
                            console.log('item: ' , item[key])
                        }
                        item.save(function (err, updatedItem) {
                            if (err || updatedItem === null) {
                                console.log('problem updating media data')
                                res.status(400).send('did not update media')
                            } else {
                                console.log('resource updated!', updatedItem)
                                res.status(200).send(updatedItem)
                            }
                        })
                    })
                } else {
                    console.log('notes', data.notes)
                    console.log('tags', data.tags)
                    UserData.findOneAndUpdate({ uid: decodedToken.uid, resource: id }, { notes: req.body.data.notes, tags: req.body.data.tags, rating: req.body.data.rating, status: req.body.data.status }, function (err, updatedData) {
                        if (err || updatedData === null) {
                            var data = {
                                notes: data.notes,
                                tags: data.tags,
                                rating: data.rating,
                                status: data.status,
                                type: type,
                                resource: id,
                                uid: decodedToken.uid
                            }
                            var userData = new UserData(data)
                            userData.save(function (err, updatedItem) {
                                if (updatedItem === null) {
                                    console.log('problem updating user data')
                                    res.status(400).send('did not update user data')
                                } else {
                                    console.log('userData updated!', updatedData)
                                    res.status(200).send('Updated UserData!')
                                }
                            })
                        } else {
                            console.log('userData updated!', updatedData)
                            res.status(200).send('Updated UserData!')
                        }
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