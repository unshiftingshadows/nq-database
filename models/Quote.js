const mongoose = require('mongoose')
const Schema = mongoose.Schema

const config = require('../nq_config.js')

const Book = require('./Book.js')
const Movie = require('./Movie.js')

var quoteSchema = new Schema({
    // author: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Author',
    //     required: true
    // },
    bibleRefs: [config.bibleRef],
    character: String,
    dateAdded: {
        type: Date,
        default: Date.now
    },
    location: {
        type: Number,
        default: 0
    },
    locationType: {
        type: String,
        enum: config.quoteLocations,
        default: 'None'
    },
    // mediaImageURL: {
    //     type: String,
    //     default: ''
    // },
    // mediaTitle: {
    //     type: String,
    //     required: true
    // },
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
    tags: {
        type: [String],
        default: []
    },
    text: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('quote', quoteSchema)