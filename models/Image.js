const mongoose = require('mongoose')
const Schema = mongoose.Schema

const config = require('../nq_config.js')

var imageSchema = new Schema({
    allTags: [String],
    attribution: {
        type: String,
        default: ''
    },
    attributionRequired: {
        type: Boolean,
        default: true
    },
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
    credit: {
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
    imageURL: {
        type: String,
        default: ''
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
        enum: config.imageSources,
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
    usageTerms: {
        type: String,
        default: ''
    },
    users: {
        type: [String],
        default: []
    }
})

module.exports = mongoose.model('image', imageSchema)