const mongoose = require('../../../db_connections/real-connect.js')
const Schema = require('mongoose').Schema

const config = require('../../../real_config.js')

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
        enum: config.realSeriesTypes,
        default: 'other'
    },
    users: {
        type: [String],
        default: []
    }
}, { toJSON: { virtuals: true } })

module.exports = mongoose.model('series', seriesSchema)