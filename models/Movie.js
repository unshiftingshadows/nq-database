const mongoose = require('mongoose')
const Schema = mongoose.Schema

const config = require('../nq_config.js')

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
    imageURL: {
        type: String,
        default: ''
    },
    releaseYear: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        required: true
    },
    users: {
        type: [String],
        default: []
    }
})

module.exports = mongoose.model('movie', movieSchema)