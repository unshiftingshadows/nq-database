const mongoose = require('../../db_connections/other-connect.js')
const Schema = require('mongoose').Schema

const Poll = require('./Poll.js')

const config = require('../../real_config.js')

var pollResponseSchema = new Schema({
    answers: {
        type: [String],
        default: []
    },
    dateTime: {
        type: Date,
        default: new Date()
    },
    uid: {
        type: String,
        required: true
    },
    pollid: {
        type: Schema.Types.ObjectId,
        ref: Poll,
        required: true
    }
}, { toJSON: { virtuals: true } })

module.exports = mongoose.model('pollResponse', pollResponseSchema)