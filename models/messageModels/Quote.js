const mongoose = require('../../db_connections/other-connect.js')
const Schema = require('mongoose').Schema

var quoteSchema = new Schema({
    bibleRefs: {
        type: [String],
        default: []
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    dateModified: {
        type: Date,
        default: Date.now
    },
    mediaid: {
        author: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        }
    },
    mediaType: {
        type: String,
        enum: ['book','movie','speech'],
        default: 'book'
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