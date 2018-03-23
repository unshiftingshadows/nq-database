const mongoose = require('../../db_connections/nq-connect.js')
const Schema = require('mongoose').Schema

const config = require('../../nq_config.js')

const Book = require('./Book.js')
const Movie = require('./Movie.js')
const Video = require('./Video.js')
const Article = require('./Article.js')
// const Document = require('./Document.js') // still haven't decided on this one...

var outlineSchema = new Schema({
    bibleRefs: [config.bibleRef],
    dateAdded: {
        type: Date,
        default: Date.now
    },
    location: {
        start: {
            type: Number,
            default: 0
        },
        end: {
            type: Number,
            default: 0
        }
    },
    locationType: {
        type: String,
        enum: config.quoteLocations,
        default: 'None'
    },
    mediaType: {
        type: String,
        enum: config.mediaTypes,
        required: true
    },
    mediaid: {
        type: Schema.Types.ObjectId,
        refPath: 'mediaType',
        required: function () {
            return this.mediaType !== 'none'
        }
    },
    notes: {
        type: String,
        default: ''
    },
    numbered: {
        type: Boolean,
        default: false
    },
    points: {
        type: [String],
        default: []
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
})

module.exports = mongoose.model('outline', outlineSchema)