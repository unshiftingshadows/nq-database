const mongoose = require('../../../db_connections/other-connect.js')
const Schema = require('mongoose').Schema

var quoteSchema = new Schema({
    author: String,
    bibleRefs: [String],
    dateAdded: {
        type: Date,
        default: Date.now
    },
    dateModified: {
        type: Date,
        default: Date.now
    },
    mediaTitle: String,
    mediaType: {
        type: String,
        enum: ['book','movie','speech'],
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    text: {
        type: String,
        default: ''
    },
    user: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('quote', quoteSchema)