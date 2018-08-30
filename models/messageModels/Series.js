const mongoose = require('../../db_connections/other-connect.js')
const Schema = require('mongoose').Schema

const config = require('../../real_config.js')

var seriesSchema = new Schema({
    createdBy: {
        type: String,
        required: true
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
        enum: config.otherSeriesTypes,
        required: true
    },
    users: {
        type: [String],
        default: []
    }
}, { toJSON: { virtuals: true } })

module.exports = mongoose.model('series', seriesSchema)