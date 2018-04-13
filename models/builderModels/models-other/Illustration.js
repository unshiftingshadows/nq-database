const mongoose = require('../../../db_connections/other-connect.js')
const Schema = require('mongoose').Schema

var illustrationSchema = new Schema({
    author: String,
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
    tags: {
        type: [String],
        default: []
    },
    title: {
        type: String,
        default: ''
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

module.exports = mongoose.model('illustration', illustrationSchema)