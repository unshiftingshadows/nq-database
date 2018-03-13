const mongoose = require('mongoose')
const Schema = mongoose.Schema

const config = require('../nq_config.js')

// import media types
const Book = require('./Book.js')
const Movie = require('./Movie.js')
const Image = require('./Image.js')
const Video = require('./Video.js')
const Article = require('./Article.js')
const Note = require('./Note.js')
const Quote = require('./Quote.js')
// const Outline = require('./Outline.js')
// const Idea = require('./Idea.js')

var topicSchema = new Schema({
    bibleRefs: {
        type: [config.bibleRef],
        default: []
    },
    conclusion: {
        type: String,
        default: ''
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    dateModified: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        default: ''
    },
    premise: {
        type: String,
        default: ''
    },
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
        },
        dateAdded: {
            type: Date,
            default: Date.now
        },
        addedBy: {
            type: String,
            required: true
        }
    }],
    // resources: {
    //     type: {
    //         books: {
    //             type: [
    //                 {
    //                     id: {
    //                         type: Schema.Types.ObjectId,
    //                         ref: 'Book',
    //                         required: true
    //                     },
    //                     dateAdded: {
    //                         type: Date,
    //                         default: Date.now
    //                     },
    //                     addedBy: {
    //                         type: String,
    //                         required: true
    //                     }
    //                 }
    //             ],
    //             default: []
    //         },
    //         movies: {
    //             type: [
    //                 {
    //                     id: {
    //                         type: Schema.Types.ObjectId,
    //                         ref: 'Movie',
    //                         required: true
    //                     },
    //                     dateAdded: {
    //                         type: Date,
    //                         default: Date.now
    //                     },
    //                     addedBy: {
    //                         type: String,
    //                         required: true
    //                     }
    //                 }
    //             ],
    //             default: []
    //         },
    //         images: {
    //             type: [
    //                 {
    //                     id: {
    //                         type: Schema.Types.ObjectId,
    //                         ref: 'Image',
    //                         required: true
    //                     },
    //                     dateAdded: {
    //                         type: Date,
    //                         default: Date.now
    //                     },
    //                     addedBy: {
    //                         type: String,
    //                         required: true
    //                     }
    //                 }
    //             ],
    //             default: []
    //         },
    //         videos: {
    //             type: [
    //                 {
    //                     id: {
    //                         type: Schema.Types.ObjectId,
    //                         ref: 'Video',
    //                         required: true
    //                     },
    //                     dateAdded: {
    //                         type: Date,
    //                         default: Date.now
    //                     },
    //                     addedBy: {
    //                         type: String,
    //                         required: true
    //                     }
    //                 }
    //             ],
    //             default: []
    //         },
    //         articles: {
    //             type: [
    //                 {
    //                     id: {
    //                         type: Schema.Types.ObjectId,
    //                         ref: 'Article',
    //                         required: true
    //                     },
    //                     dateAdded: {
    //                         type: Date,
    //                         default: Date.now
    //                     },
    //                     addedBy: {
    //                         type: String,
    //                         required: true
    //                     }
    //                 }
    //             ],
    //             default: []
    //         },
    //         notes: {
    //             type: [
    //                 {
    //                     id: {
    //                         type: Schema.Types.ObjectId,
    //                         ref: 'Note',
    //                         required: true
    //                     },
    //                     dateAdded: {
    //                         type: Date,
    //                         default: Date.now
    //                     },
    //                     addedBy: {
    //                         type: String,
    //                         required: true
    //                     }
    //                 }
    //             ],
    //             default: []
    //         },
    //         documents: {
    //             type: [
    //                 {
    //                     id: {
    //                         type: Schema.Types.ObjectId,
    //                         ref: 'Document',
    //                         required: true
    //                     },
    //                     dateAdded: {
    //                         type: Date,
    //                         default: Date.now
    //                     },
    //                     addedBy: {
    //                         type: String,
    //                         required: true
    //                     }
    //                 }
    //             ],
    //             default: []
    //         },
    //         quotes: {
    //             type: [
    //                 {
    //                     id: {
    //                         type: Schema.Types.ObjectId,
    //                         ref: 'Quote',
    //                         required: true
    //                     },
    //                     dateAdded: {
    //                         type: Date,
    //                         default: Date.now
    //                     },
    //                     addedBy: {
    //                         type: String,
    //                         required: true
    //                     }
    //                 }
    //             ],
    //             default: []
    //         },
    //         outlines: {
    //             type: [
    //                 {
    //                     id: {
    //                         type: Schema.Types.ObjectId,
    //                         ref: 'Outline',
    //                         required: true
    //                     },
    //                     dateAdded: {
    //                         type: Date,
    //                         default: Date.now
    //                     },
    //                     addedBy: {
    //                         type: String,
    //                         required: true
    //                     }
    //                 }
    //             ],
    //             default: []
    //         },
    //         ideas: {
    //             type: [
    //                 {
    //                     id: {
    //                         type: Schema.Types.ObjectId,
    //                         ref: 'Idea',
    //                         required: true
    //                     },
    //                     dateAdded: {
    //                         type: Date,
    //                         default: Date.now
    //                     },
    //                     addedBy: {
    //                         type: String,
    //                         required: true
    //                     }
    //                 }
    //             ],
    //             default: []
    //         }
    //     }
    // },
    tags: {
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
})

module.exports = mongoose.model('topic', topicSchema)