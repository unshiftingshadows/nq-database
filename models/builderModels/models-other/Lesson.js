const mongoose = require('../../../db_connections/other-connect.js')
const Schema = require('mongoose').Schema

const config = require('../../../real_config.js')

const Series = require('./Series.js')

var lessonSchema = new Schema({
    bibleRefs: [config.bibleRefSchema],
    collaborators: {
        type: [String],
        default: []
    },
    content: {
        application: {
            type: String,
            default: ''
        },
        hook: {
            type: String,
            default: ''
        },
        main: {
            type: String,
            default: ''
        },
        prayer: {
            type: String,
            default: ''
        }
    },
    mainIdea: {
        type: String,
        default: ''
    },
    media: [config.mediaRefSchema],
    research: [config.researchRefSchema],
    seriesID: {
        type: Schema.Types.ObjectId,
        ref: 'series'
    },
    tags: {
        type: [String],
        default: []
    },
    title: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    }
}, { toJSON: { virtuals: true } })

module.exports = mongoose.model('lesson', lessonSchema)