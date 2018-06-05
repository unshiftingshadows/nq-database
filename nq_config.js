var mediaTypes = [
    'book',
    'movie',
    'image',
    'video',
    'article',
    'document',
    'note',
    'discourse',
    'composition',
    'quote',
    'outline',
    'idea',
    'illustration',
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
    'upload'
]

var videoSources = [
    'youtube',
    'vimeo'
]

var compositionTypes = [
    'song',
    'poem'
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
        enum: ['single', 'simpleRange', 'complexRange', 'chapter', 'chapterRange', 'book'],
        required: true
    },
    verse: Number,
    verser: Number
}

module.exports = {
    mediaTypes: mediaTypes,
    status: status,
    imageSources: imageSources,
    videoSources: videoSources,
    compositionTypes: compositionTypes,
    quoteLocations: quoteLocations,
    bibleRef: bibleRefSchema
}