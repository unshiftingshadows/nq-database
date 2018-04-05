const ObjectId = require('mongoose').Schema.Types.ObjectId

const Book = require('./models/nqModels/Book.js')
const Movie = require('./models/nqModels/Movie.js')
const Image = require('./models/nqModels/Image.js')
const Video = require('./models/nqModels/Video.js')
const Article = require('./models/nqModels/Article.js')
const Note = require('./models/nqModels/Note.js')
const Quote = require('./models/nqModels/Quote.js')
const Outline = require('./models/nqModels/Outline.js')
const Idea = require('./models/nqModels/Idea.js')
const UserData = require('./models/nqModels/UserData.js')

const Topic = require('./models/nqModels/Topic.js')

var realTypes = [
    'series',
    'lesson',
    'devo',
    'guide',
    'review'
]

var otherTypes = [
    'series',
    'lesson'
]

var seriesTypes = [
    'bible',
    'theology',
    'culture',
    'other'
]

var bibleRefSchema = {
    book: String,
    chapter: Number,
    chapterr: Number,
    type: {
        type: String,
        enum: ['single', 'simpleRange', 'complexRange', 'chapter', 'chapterRange', 'book'],
        required: true
    },
    verse: Number,
    verser: Number
}

var mediaRefSchema = {
    id: {
        type: ObjectId,
        refPath: 'type',
        required: true
    },
    type: {
        type: String,
        enum: ['book', 'movie', 'image', 'video', 'article', 'note', 'document', 'quote', 'outline', 'idea'],
        required: true
    }
}

var researchRefSchema = {
    media: {
        type: ObjectId,
        refPath: 'research.type',
        required: true
    },
    type: {
        type: String,
        enum: ['topic'],
        required: true
    }
}

var initOLesson = {
    hook: {
        title: '',
        text: '',
        wordcount: 0,
        time: 0,
        slide: false,
        editing: false
    },
    application: {
        title: '',
        today: '',
        thisweek: '',
        thought: '',
        wordcount: 0,
        time: 0,
        slide: false,
        editing: false
    },
    prayer: {
        text: '',
        wordcount: 0,
        time: 0,
        slide: false,
        editing: false
    }
}

module.exports = {
    realTypes: realTypes,
    otherTypes: otherTypes,
    seriesTypes: seriesTypes,
    bibleRefSchema: bibleRefSchema,
    mediaRefSchema: mediaRefSchema,
    researchRefSchema: researchRefSchema,
    initOLesson: initOLesson
}
