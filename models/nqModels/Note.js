const mongoose = require('../../db_connections/nq-connect.js')
const Schema = require('mongoose').Schema

const config = require('../../nq_config.js')

var noteSchema = new Schema({
    bibleRefs: {
        type: [config.bibleRef],
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
    text: {
        type: String,
        default: ''
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

module.exports = mongoose.model('note', noteSchema)