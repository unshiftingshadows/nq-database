const mongoose = require('../../db_connections/real-connect')
const Schema = require('mongoose').Schema

const config = require('../../real_config.js')
const nqConfig = require('../../nq_config.js')

// Import NQ Media Types
const Book = require('../nqModels/Book.js')
const Movie = require('../nqModels/Movie.js')
const Image = require('../nqModels/Image.js')
const Video = require('../nqModels/Video.js')
const Article = require('../nqModels/Article.js')
const Note = require('../nqModels/Note.js')
const Composition = require('../nqModels/Composition.js')
const Document = require('../nqModels/Document.js')
const Discourse = require('../nqModels/Discourse.js')
const Quote = require('../nqModels/Quote.js')
const Outline = require('../nqModels/Outline.js')
const Idea = require('../nqModels/Idea.js')
const Illustration = require('../nqModels/Illustration.js')

// Import NQ Research Types
const Topic = require('../nqModels/Topic.js')

var devoSchema = new Schema({
    devoid: {
        type: String,
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
    }],
    resources: [{
        type: {
            type: String,
            enum: nqConfig.mediaTypes,
            required: true
        },
        media: {
            type: Schema.Types.ObjectId,
            refPath: 'resources.type',
            required: true
        }
    }]
}, { toJSON: { virtuals: true } })

module.exports = mongoose.model('devo', devoSchema)