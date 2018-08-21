const mongoose = require('../../db_connections/nq-connect.js')
const Schema = require('mongoose').Schema

const config = require('../../nq_config.js')

var videoSchema = new Schema({
    allTags: [String],
    author: {
        type: [String],
        default: []
    },
    authorURL: {
        type: String,
        default: ''
    },
    bibleRefs: {
        type: [config.bibleRef],
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
    description: {
        type: String,
        default: ''
    },
    duration: {
        type: Number,
        default: 0
    },
    embedHTML: {
        type: String,
        required: true
    },
    embedURL: {
        type: String,
        required: true
    },
    pageURL: {
        type: String,
        required: true
    },
    postDate: {
        type: Date,
        default: Date.now
    },
    source: {
        type: String,
        enum: config.videoSources,
        required: true
    },
    thumbURL: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    videoID: {
        type: String,
        required: true
    },
    userData: {
        type: Map,
        of: String
    },
    users: {
        type: [String],
        default: []
    }
})

module.exports = mongoose.model('video', videoSchema)