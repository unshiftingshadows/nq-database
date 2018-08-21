const mongoose = require('../../db_connections/nq-connect.js')
const Schema = require('mongoose').Schema

const config = require('../../nq_config.js')

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
    fileType: {
        type: String,
        required: true
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
}, { toJSON: { virtuals: true } })

module.exports = mongoose.model('document', documentSchema)