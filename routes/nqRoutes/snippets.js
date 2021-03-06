const config = require('../../nq_config.js')
const firebase = require('../../firebase.js').nq
const mongoose = require('mongoose')

var ObjectId = mongoose.Types.ObjectId

// Import media types
const Quote = require('../../models/nqModels/Quote.js')
const Outline = require('../../models/nqModels/Outline.js')
const Idea = require('../../models/nqModels/Idea.js')
const Illustration = require('../../models/nqModels/Illustration.js')

var snippetType = {
    'quotes': Quote,
    'outlines': Outline,
    'ideas': Idea,
    'illustration': Illustration
}

module.exports = function (req, res) {
    console.log('id', req.body.id)
    var token = req.body.token

    firebase.verifyID(token)
        .then(function(decodedToken) {
            var type = req.body.type
            var id = req.body.id
            console.log('type', type)
            console.log('id', id)
            if (type === 'all') {
                Promise.all([
                    Quote.find({ mediaid: new ObjectId(req.body.id), user: decodedToken.uid }).sort('location').exec(),
                    Outline.find({ mediaid: new ObjectId(req.body.id), user: decodedToken.uid }).sort('location.start').exec(),
                    Idea.find({ mediaid: new ObjectId(req.body.id), user: decodedToken.uid }).sort('location.start').exec(),
                    Illustration.find({ mediaid: new ObjectId(req.body.id), user: decodedToken.uid }).sort('location.start').exec()
                ]).then((items) => {
                    console.log('snippets', items)
                    res.send(items)
                }).catch((err) => {
                    console.log('something wrong with promise.all...')
                    res.status(400).send('Invalid query type')
                })
            } else {
                snippetType[type].find({ mediaid: new ObjectId(req.body.id), user: decodedToken.uid }).sort('location location.start').exec(function (err, items) {
                    if (err) console.log(err.message)
                    // console.log(quotes)
                    console.log('snippets', items.length)
                    res.send(items)
                })
            }
        })
        .catch(function(err) {
            console.log('error with token')
            res.status(400).send('Invalid user token')
        })
}