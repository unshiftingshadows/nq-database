const mongoose = require('../../db_connections/nq-connect.js')
const Schema = require('mongoose').Schema

const config = require('../../nq_config.js')

var compositionSchema = new Schema({
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
    pageURL: {
        type: String,
        default: ''
    },
    text: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: config.compositionTypes,
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

module.exports = mongoose.model('composition', compositionSchema)
