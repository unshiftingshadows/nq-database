const mongoose = require('../../../db_connections/other-connect.js')
const Schema = require('mongoose').Schema

const config = require('../../../real_config.js')

const Series = require('./Series.js')

const Selection = require('../../nqModels/Selection.js')

var archiveSchema = new Schema({
    bibleRefs: {
        type: [String],
        default: []
    }, // refs that the lesson is primarily focused on, not all refs used in the lesson
    content: {
        structure: {
            before: {
                hook: {
                    editing: Boolean,
                    show: Boolean,
                    time: Number,
                    wordcount: Number
                }
            },
            after: {
                application: {
                    editing: Boolean,
                    show: Boolean,
                    thisweek: String,
                    thought: String,
                    time: Number,
                    title: String,
                    today: String,
                    wordcount: Number
                },
                prayer: {
                    editing: Boolean,
                    show: Boolean,
                    text: String,
                    time: Number,
                    wordcount: Number
                }
            }
        },
        modules: [Schema.Types.Mixed],
        sectionModules: [Schema.Types.Mixed],
        sections: [{
            key: String,
            editing: Boolean,
            order: Number,
            static: Boolean,
            title: String
        }]
    },
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
    // selection: {
    //     type: Schema.Types.ObjectId,
    //     ref: Selection
    // },
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
    type: {
        type: String,
        enum: config.otherTypes,
        required: true
    },
    users: {
        type: [String],
        default: []
    }
}, { toJSON: { virtuals: true } })

module.exports = mongoose.model('archive', archiveSchema)