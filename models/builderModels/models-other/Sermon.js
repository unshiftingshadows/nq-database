const mongoose = require('../../../db_connections/other-connect.js')
const Schema = require('mongoose').Schema

const config = require('../../../real_config.js')

const Series = require('./Series.js')

const Selection = require('../../nqModels/Selection.js')

var sermonSchema = new Schema({
    bibleRefs: {
        type: [String],
        default: []
    }, // refs that the lesson is primarily focused on, not all refs used in the lesson
    createdBy: {
        type: String,
        required: true
    },
    mainIdea: {
        type: String,
        default: ''
    },
    media: [config.mediaRefSchema], // any media added from the builder side, not associated with a research object
    research: [config.researchRefSchema],
    selection: {
        type: Schema.Types.ObjectId,
        ref: Selection
    },
    seriesID: {
        type: Schema.Types.ObjectId,
        ref: 'series'
    },
    tags: { // used in searching for lessons later
        type: [String],
        default: []
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

module.exports = mongoose.model('sermon', sermonSchema)