const mongoose = require('../../../db_connections/real-connect.js')
const Schema = require('mongoose').Schema

const config = require('../../../real_config.js')

var seriesSchema = new Schema({
    collaborators: {
        type: [String],
        default: []
    },
    mainIdea: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: config.seriesTypes,
        default: 'other'
    },
    user: {
        type: String,
        required: true
    }
}, { toJSON: { virtuals: true } })

module.exports = mongoose.model('series', seriesSchema)