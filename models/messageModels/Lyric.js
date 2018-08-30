const mongoose = require('../../db_connections/other-connect.js')
const Schema = require('mongoose').Schema

var lyricSchema = new Schema({
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
    medium: {
        type: String,
        enum: ['song', 'poem'],
        default: 'song'
    },
    tags: {
        type: [String],
        default: []
    },
    text: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    user: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('lyric', lyricSchema)