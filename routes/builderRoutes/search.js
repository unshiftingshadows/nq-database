const config = require('../../real_config.js')
const firebase = require('../../firebase.js').real
const Fuse = require('fuse.js')

// Import content types
const SeriesReal = require('../../models/builderModels/Series.js')
// const SeriesOther = require('../../models/builderModels/models-other/Series.js')
// const LessonOther = require('../../models/builderModels/models-other/Lesson.js')

const Topic = require('../../models/nqModels/Topic.js')

// Import NQ media types
const Book = require('../../models/nqModels/Book.js')
const Movie = require('../../models/nqModels/Movie.js')
const Image = require('../../models/nqModels/Image.js')
const Video = require('../../models/nqModels/Video.js')
const Article = require('../../models/nqModels/Article.js')
const Note = require('../../models/nqModels/Note.js')
const Doc = require('../../models/nqModels/Document.js')
const Discourse = require('../../models/nqModels/Discourse.js')
const Composition = require('../../models/nqModels/Composition.js')
const Quote = require('../../models/nqModels/Quote.js')
const Outline = require('../../models/nqModels/Outline.js')
const Idea = require('../../models/nqModels/Idea.js')
const Illustration = require('../../models/nqModels/Illustration.js')

const nqMedia = {
    'book': Book,
    'movie': Movie,
    'image': Image,
    'video': Video,
    'article': Article,
    'note': Note,
    'document': Doc,
    'discourse': Discourse,
    'composition': Composition,
    'quote': Quote,
    'outline': Outline,
    'idea': Idea,
    'illustration': Illustration
}

// Import other media types
// const OQuote = require('../../models/builderModels/models-other/Quote.js')
// const OImage = require('../../models/builderModels/models-other/Image.js')
// const OIllustration = require('../../models/builderModels/models-other/Illustration.js')
// const OLyric = require('../../models/builderModels/models-other/Lyric.js')
// const OVideo = require('../../models/builderModels/models-other/Video.js')

// const otherMedia = {
//     'quote': OQuote,
//     'image': OImage,
//     'illustration': OIllustration,
//     'lyric': OLyric,
//     'video': OVideo
// }

var realContent = {
    'rseries': SeriesReal
}

// var otherContent = {
//     'oseries': SeriesOther,
//     'olessons': LessonOther
// }

module.exports = function (req, res) {
    console.log('--builder search run--')
    console.log('type', req.body.type)
    console.log('search', req.body.terms)
    var token = req.body.token
    
    firebase.verifyID(token)
        .then(function(decodedToken) {
            var type = req.body.type
            var terms = req.body.terms
            var options = req.body.options
            console.log('uid', decodedToken.uid)
            if (Object.keys(realContent).includes(type)) {
                realContent[type].find({}).where('user', decodedToken.uid).exec(function (err, items) {
                    if (err) console.log(err)
                    console.log(items)
                    res.send(items)
                })
            } else if (type === 'topic') {
                console.log('topic search')
                // TODO: Add reference here to the connected nq account so as to get only
                //       topics from the current user rather than all topics in NQ
                var query = Topic.find({})
                if (!options.data) {
                    query = query.select('_id title')
                }
                query.exec(function (err, items) {
                    if (err) console.log(err)
                    console.log(items)
                    // Search with fuse
                    var options = {
                        keys: ['title']
                    }
                    var search = new Fuse(items, options)
                    var result = search.search(terms)
                    console.log(items)
                    res.send(items)
                })
            } else if (type === 'nqmedia') {
                console.log('nq media search')
                Promise.all(Object.keys(nqMedia).map((e) => { return nqMedia[e].find().lean().populate({ path: 'mediaid', type: 'mediaType', select: 'title author thumbURL' }).exec()})).then((items) => {
                    // console.log('init items', items)
                    var listTypes = Object.keys(nqMedia)
                    var allItems = []
                    items.forEach((listType, index) => {
                        listType.forEach((item) => {
                            // console.log('item', item, listTypes[index])
                            allItems.push({
                                media: item,
                                type: listTypes[index]
                            })
                        })
                    })
                    // var allItems = items[0].concat(items[1], items[2], items[3], items[4])
                    // Search with fuse
                    var options = {
                        shouldSort: true,
                        keys: [{
                            name: 'media.text',
                            weight: 0.1
                        }, {
                            name: 'media.title',
                            weight: 0.3
                        }, {
                            name: 'media.tags',
                            weight: 0.6
                        }]
                    }
                    var search = new Fuse(allItems, options)
                    var result = search.search(terms)
                    console.log('full length', allItems.length)
                    console.log('result length', result.length)
                    res.send(result.slice(0, 50))
                })
                .catch(function(err) {
                    console.log('error with search media', err)
                    res.status(400).send('Bad search')
                })
            } else {
                console.log('something went wrong - search')
            }
        })
        .catch(function(err) {
            console.log('error with token', err)
            res.status(400).send('Invalid user token')
        })
}