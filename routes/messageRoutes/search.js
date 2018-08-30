const config = require('../../real_config.js')
const firebase = require('../../firebase.js').real
const Fuse = require('fuse.js')

// Import content types
// const SeriesReal = require('../../models/builderModels/models-real/Series.js')
const SeriesOther = require('../../models/messageModels/Series.js')
const LessonOther = require('../../models/messageModels/Lesson.js')

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
const OQuote = require('../../models/messageModels/Quote.js')
const OImage = require('../../models/messageModels/Image.js')
const OIllustration = require('../../models/messageModels/Illustration.js')
const OLyric = require('../../models/messageModels/Lyric.js')
const OVideo = require('../../models/messageModels/Video.js')

const otherMedia = {
    'quote': OQuote,
    'image': OImage,
    'illustration': OIllustration,
    'lyric': OLyric,
    'video': OVideo
}

// var realContent = {
//     'rseries': SeriesReal
// }

var otherContent = {
    'series': SeriesOther,
    'lessons': LessonOther
}

module.exports = function (req, res) {
    console.log('--message search run--')
    console.log('type', req.body.type)
    console.log('search', req.body.terms)
    var token = req.body.token
    
    firebase.verifyID(token)
        .then(function(decodedToken) {
            var type = req.body.type
            var terms = req.body.terms
            var options = req.body.options
            console.log('uid', decodedToken.uid)
            if (Object.keys(otherContent).includes(type)) {
                var query = otherContent[type].find({})
                if (!options.data) {
                    query = query.select('_id title')
                }
                for (term in terms) {
                    console.log(term)
                    query = query.$where('this.' + term + '.search(\"' + terms[term] + '\") !== -1')
                }
                query.exec(function (err, items) {
                    if (err) console.log(err)
                    console.log('items', items)
                    if (options.autocomplete) {
                        var array = []
                        items.forEach((item) => {
                            array.push({
                                label: item.title,
                                value: item._id
                            })
                        })
                        console.log(array)
                        res.send(array)
                    } else {
                        console.log(items)
                        res.send(items)
                    }
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
            } else if (type === 'omedia') {
                console.log('other media search')
                Promise.all([
                    OQuote.find({ user: decodedToken.uid }).lean().exec(),
                    OImage.find({ user: decodedToken.uid }).lean().exec(),
                    OIllustration.find({ user: decodedToken.uid }).lean().exec(),
                    OLyric.find({ user: decodedToken.uid }).lean().exec(),
                    OVideo.find({ user: decodedToken.uid }).lean().exec()
                ]).then((items) => {
                    console.log(items)
                    var listTypes = ['quote', 'image', 'illustration', 'lyric', 'video']
                    var allItems = []
                    items.forEach((listType, index) => {
                        listType.forEach((item) => {
                            item.type = listTypes[index]
                            console.log('item', item, listTypes[index])
                            allItems.push(item)
                        })
                    })
                    // var allItems = items[0].concat(items[1], items[2], items[3], items[4])
                    // Search with fuse
                    var options = {
                        keys: [{
                            name: 'text',
                            weight: 0.1
                        }, {
                            name: 'title',
                            weight: 0.3
                        }, {
                            name: 'tags',
                            weight: 0.6
                        }]
                    }
                    var search = new Fuse(allItems, options)
                    var result = search.search(terms)
                    console.log(result)
                    res.send(result)
                })
                .catch(function(err) {
                    console.log('error with search media', err)
                    res.status(400).send('Bad search')
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