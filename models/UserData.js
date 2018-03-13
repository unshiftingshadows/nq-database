const mongoose = require('mongoose')
const Schema = mongoose.Schema

const config = require('../nq_config.js')

var userDataSchema = new Schema({
    uid: {
        type: String,
        required: true
    },
    resource: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: config.mediaTypes,
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    tags: {
        type: [String],
        default: []
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    status: {
        type: String,
        enum: config.status,
        default: 'new'
    }
}, { collection: 'userDatas' })

module.exports = mongoose.model('UserData', userDataSchema)