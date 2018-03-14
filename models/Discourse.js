const mongoose = require('mongoose')
const Schema = mongoose.Schema

const config = require('../nq_config.js')

var discourseSchema = new Schema({
    author: [{
        type: String,
        required: true
    }],
    bibleRefs: {
        type: [config.bibleRef],
        default: []
    },
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
    dateOccurred: {
        type: Date,
        default: Date.now
    },
    tags: {
        type: [String],
        default: []
    },
    title: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    }
}, { toJSON: { virtuals: true } })

module.exports = mongoose.model('discourse', discourseSchema)