const mongoose = require('../../../db_connections/other-connect.js')
const Schema = require('mongoose').Schema

const config = require('../../../real_config.js')

var pollSchema = new Schema({
    excludedUsers: {
        type: [String],
        default: []
    },
    questions: [{
        type: {
            type: String,
            enum: config.pollQuestionTypes,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        max: String,
        min: String,
        options: [],
        required: Boolean
    }],
    showCriteria: [{
        type: {
            type: String,
            enum: config.pollShowCriteria
        },
        value: Schema.Types.Mixed,
        comparator: {
            type: String,
            enum: ['gt', 'gte', 'lt', 'lte', 'eq']
        }
    }],
    cumCriteria: {
        type: Boolean,
        default: true // meaning that all criteria must be true -- false would mean that any one criteria would satisfy the criteria
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    users: {
        type: [String],
        default: []
    },
    welcomeMessage: {
        type: String,
        default: 'Please complete the questions below'
    },
    askMessage: {
        type: String,
        default: 'Let us know how we\'re doing!'
    },
    thanksMessage: {
        type: String,
        default: 'Thanks for your feedback!'
    },
    acceptMessage: {
        type: String,
        default: 'Sure!'
    },
    rejectMessage: {
        type: String,
        default: 'No thanks'
    }
}, { toJSON: { virtuals: true } })

module.exports = mongoose.model('poll', pollSchema)