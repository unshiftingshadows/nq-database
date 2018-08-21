const mongoose = require('../../db_connections/nq-connect.js')
const Schema = require('mongoose').Schema

const config = require('../../nq_config.js')

const Author = require('./Author.js')

var movieSchema = new Schema({
    allTags: [String],
    author: [{
        type: String
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
    moviedbid: String,
    releaseYear: {
        type: String,
        default: ''
    },
    thumbURL: {
        type: String,
        default: ''
    },
    title: {
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

module.exports = mongoose.model('movie', movieSchema)