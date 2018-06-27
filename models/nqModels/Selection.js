const mongoose = require('../../db_connections/nq-connect.js')
const Schema = require('mongoose').Schema

const config = require('../../nq_config.js')

// import media types
const Book = require('./Book.js')
const Movie = require('./Movie.js')
const Image = require('./Image.js')
const Video = require('./Video.js')
const Article = require('./Article.js')
const Note = require('./Note.js')
const Composition = require('./Composition.js')
const Document = require('./Document.js')
const Discourse = require('./Discourse.js')
const Quote = require('./Quote.js')
const Outline = require('./Outline.js')
const Idea = require('./Idea.js')
const Illustration = require('./Illustration.js')

var selectionSchema = new Schema({
    resources: [{
        type: {
            type: String,
            enum: config.mediaTypes,
            required: true
        },
        media: {
            type: Schema.Types.ObjectId,
            refPath: 'resources.type',
            required: true
        }
    }]
})

module.exports = mongoose.model('selection', selectionSchema)