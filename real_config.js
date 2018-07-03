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
    'lesson',
    'sermon'
]

var realSeriesTypes = [
    'bible',
    'theology',
    'culture',
    'other'
]

var otherSeriesTypes = [
    'lesson',
    'sermon'
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
    before: {
        hook: {
            text: '',
            wordcount: 0,
            time: 0,
            slide: false,
            editing: false
        }
    },
    after: {
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
}

var initOSermon = {
    before: {
        hook: {
            title: '',
            text: '',
            wordcount: 0,
            time: 0,
            slide: false,
            editing: false
        }
    },
    after: {
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
}

// Templates
var templates = {
    '3point': {
        'section1': {
            editing: false,
            number: 1,
            order: 0,
            slide: false,
            time: 0,
            title: 'Section 1',
            type: 'section',
            wordcount: 0
        },
        'text1': {
            editing: false,
            order: 1,
            slide: false,
            text: '<p>Section 1\'s text...make it good! :-)',
            time: 1,
            title: 'Section 1 Text',
            type: 'text',
            wordcount: 6
        },
        'section2': {
            editing: false,
            number: 2,
            order: 2,
            slide: false,
            time: 0,
            title: 'Section 2',
            type: 'section',
            wordcount: 0
        },
        'text2': {
            editing: false,
            order: 3,
            slide: false,
            text: '<p>Section 2\'s text...it can be less good',
            time: 1,
            title: 'Section 2 Text',
            type: 'text',
            wordcount: 8
        },
        'section3': {
            editing: false,
            number: 3,
            order: 4,
            slide: false,
            time: 0,
            title: 'Section 3',
            type: 'section',
            wordcount: 0
        },
        'text3': {
            editing: false,
            order: 5,
            slide: false,
            text: '<p>Section 3\'s text...gotta be amazing!!!',
            time: 1,
            title: 'Section 3 Text',
            type: 'text',
            wordcount: 6
        }
    }
}

// Poll Types
var pollQuestionTypes = ['short', 'selectOne', 'selectMultiple', 'slider', 'yesNo']

module.exports = {
    realTypes: realTypes,
    otherTypes: otherTypes,
    realSeriesTypes: realSeriesTypes,
    otherSeriesTypes: otherSeriesTypes,
    bibleRefSchema: bibleRefSchema,
    mediaRefSchema: mediaRefSchema,
    researchRefSchema: researchRefSchema,
    initOLesson: initOLesson,
    initOSermon: initOSermon,
    pollQuestionTypes: pollQuestionTypes
}
