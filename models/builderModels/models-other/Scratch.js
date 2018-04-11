const mongoose = require('../../../db_connections/other-connect.js')
const Schema = require('mongoose').Schema

const config = require('../../../real_config.js')

var scratchSchema = new Schema({
    bibleRefs: [config.bibleRefSchema], // refs that the lesson is primarily focused on, not all refs used in the lesson
    createdBy: {
        type: String,
        required: true
    },
    tags: { // used in searching for lessons later
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
    users: {
        type: [String],
        default: []
    }
}, { toJSON: { virtuals: true } })

module.exports = mongoose.model('scratch', scratchSchema)