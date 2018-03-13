const mongoose = require('mongoose')
const Schema = mongoose.Schema

const config = require('../nq_config.js')

const Author = require('./Author.js')

var articleSchema = new Schema({
    allTags: [String],
    author: [{
        type: String,
        required: true
    }],
    bibleRefs: [config.bibleRef],
    citation: {
        type: String,
        default: ''
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
    html: {
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
    thumbURL: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    users: {
        type: [String],
        default: []
    },
    wordCount: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('article', articleSchema)