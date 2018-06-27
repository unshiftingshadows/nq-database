const mongoose = require('../../../db_connections/real-connect.js')
const Schema = require('mongoose').Schema

const config = require('../../../real_config.js')
const nqConfig = require('../../../nq_config.js')

// Import NQ Research Types
const Topic = require('../../nqModels/Topic.js')
const Selection = require('../../nqModels/Selection.js')

var lessonSchema = new Schema({
    lessonid: {
        type: String,
        required: true
    },
    selection: {
        type: Schema.Types.ObjectId,
        ref: Selection,
        required: true
    },
    research: [{
        type: {
            type: String,
            enum: nqConfig.researchTypes,
            required: true
        },
        media: {
            type: Schema.Types.ObjectId,
            refPath: 'research.type',
            required: true
        }
    }]
})

module.exports = mongoose.model('lesson', lessonSchema)