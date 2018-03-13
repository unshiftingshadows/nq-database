const config = require('../nq_config.js')
const firebase = require('../firebase.js')
const mongoose = require('mongoose')

var ObjectId = mongoose.Types.ObjectId

// Import media types
const Quote = require('../models/Quote.js')

module.exports = function (req, res) {
    console.log('id', req.body.id)
    var token = req.body.token

    firebase.verifyID(token)
        .then(function(decodedToken) {
            var id = req.body.id
            console.log('id', id)
            Quote.find({ mediaid: new ObjectId(req.body.id), user: decodedToken.uid }).sort('location').exec(function (err, quotes) {
                if (err) console.log(err.message)
                // console.log(quotes)
                console.log('quotes', quotes.length)
                res.send(quotes)
            })
        })
        .catch(function(err) {
            console.log('error with token')
            res.status(400).send('Invalid user token')
        })
}