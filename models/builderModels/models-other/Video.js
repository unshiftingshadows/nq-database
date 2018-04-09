const mongoose = require('../../../db_connections/other-connect.js')
const Schema = require('mongoose').Schema

var videoSchema = new Schema({
    bibleRefs: [String],
    dateAdded: {
        type: Date,
        default: Date.now
    },
    dateModified: {
        type: Date,
        default: Date.now
    },
    embedURL: {
        type: String,
        required: true
    },
    pageURL: {
        type: String,
        required: true
    },
    service: {
        type: String,
        enum: ['youtube', 'vimeo'],
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    thumbURL: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: ''
    },
    user: {
        type: String,
        required: true
    },
    videoID: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('video', videoSchema)