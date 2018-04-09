const mongoose = require('../../../db_connections/other-connect.js')
const Schema = require('mongoose').Schema

var imageSchema = new Schema({
    bibleRefs: [String],
    dateAdded: {
        type: Date,
        default: Date.now
    },
    dateModified: {
        type: Date,
        default: Date.now
    },
    imageURL: {
        type: String,
        default: ''
    },
    service: {
        type: String,
        enum: ['wiki', 'link', 'storage'],
        required: true
    },
    storageID: {
        type: String,
        default: ''
    },
    tags: {
        type: [String],
        default: []
    },
    thumbURL: {
        type: String,
        default: ''
    },
    user: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('image', imageSchema)