const mongoose = require('mongoose')
const Schema = mongoose.Schema

const config = require('../nq_config.js')

var documentSchema = new Schema({
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
    dateProduced: {
        type: Date,
        default: Date.now
    },
    fileid: {
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

module.exports = mongoose.model('document', documentSchema)