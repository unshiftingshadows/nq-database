const config = require('../nq_config.js')
const firebase = require('../firebase.js')
const mongoose = require('mongoose')

var ObjectId = mongoose.Types.ObjectId

// Import media types
const Quote = require('../models/Quote.js')
const Outline = require('../models/Outline.js')
const Idea = require('../models/Idea.js')

var snippetType = {
    'quotes': Quote,
    'outlines': Outline,
    'ideas': Idea
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
            snippetType[type].find({ mediaid: new ObjectId(req.body.id), user: decodedToken.uid }).sort('location location.start').exec(function (err, items) {
                if (err) console.log(err.message)
                // console.log(quotes)
                console.log('snippets', items.length)
                res.send(items)
            })
        })
        .catch(function(err) {
            console.log('error with token')
            res.status(400).send('Invalid user token')
        })
}