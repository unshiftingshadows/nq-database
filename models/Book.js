const mongoose = require('mongoose')
const Schema = mongoose.Schema

const config = require('../nq_config.js')

const Author = require('./Author.js')

var bookSchema = new Schema({
    allTags: [String],
    author: [{
        type: String,
        required: true
    }],
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
    googleid: String,
    isbn: {
        type: String,
        required: true
    },
    pubYear: {
        type: String,
        default: ''
    },
    publisher: {
        type: String,
        default: ''
    },
    thumbURL: {
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
    }
}, { toJSON: { virtuals: true } })

module.exports = mongoose.model('book', bookSchema)