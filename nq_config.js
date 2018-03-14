var mediaTypes = [
    'book',
    'movie',
    'image',
    'video',
    'article',
    'document',
    'note',
    'discourse',
    'quote',
    'outline',
    'idea',
    'topic',
    'resource', // used for adding resources to topics
    'none' // used for quotes that don't have a specific resource attached...still contemplating...
]

var status = [
    'new',
    'current',
    'viewed',
    'read'
]

var imageSources = [
    'wiki',
    'link',
    'storage'
]

var videoSources = [
    'youtube',
    'vimeo'
]

var quoteLocations = [
    'None',
    'Page',
    'Chapter',
    'Kindle',
    'Other'
]

var bibleRefSchema = {
    book: String,
    chapter: Number,
    chapterr: Number,
    type: {
        type: String,
        enum: ['single', 'simpleRange', 'complexRange'],
        required: true
    },
    verse: Number,
    verser: Number
}

module.exports = {
    mediaTypes: mediaTypes,
    status: status,
    quoteLocations: quoteLocations,
    bibleRef: bibleRefSchema
}