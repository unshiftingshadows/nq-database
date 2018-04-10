const config = require('../../real_config.js')
const firebase = require('../../firebase.js').builder
const Fuse = require('fuse.js')

// Import media types
const SeriesReal = require('../../models/builderModels/models-real/Series.js')
const SeriesOther = require('../../models/builderModels/models-other/Series.js')
const LessonOther = require('../../models/builderModels/models-other/Lesson.js')

const Topic = require('../../models/nqModels/Topic.js')

// Import other media types
const OQuote = require('../../models/builderModels/models-other/Quote.js')
const OImage = require('../../models/builderModels/models-other/Image.js')
const OIllustration = require('../../models/builderModels/models-other/Illustration.js')
const OLyric = require('../../models/builderModels/models-other/Lyric.js')
const OVideo = require('../../models/builderModels/models-other/Video.js')

const otherMedia = {
    'quote': OQuote,
    'image': OImage,
    'illustration': OIllustration,
    'lyric': OLyric,
    'video': OVideo
}

var realContent = {
    'rseries': SeriesReal
}

var otherContent = {
    'oseries': SeriesOther,
    'olessons': LessonOther
}

module.exports = function (req, res) {
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
            } else if (Object.keys(realContent).includes(type)) {
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
            } else if (type === 'omedia') {
                console.log('other media search')
                Promise.all([
                    OQuote.find({ user: decodedToken.uid }).exec(),
                    OImage.find({ user: decodedToken.uid }).exec(),
                    OIllustration.find({ user: decodedToken.uid }).exec(),
                    OLyric.find({ user: decodedToken.uid }).exec(),
                    OVideo.find({ user: decodedToken.uid }).exec()
                ]).then((items) => {
                    console.log(items)
                    var listTypes = ['quote', 'image', 'illustration', 'lyric', 'video']
                    items.forEach((listType, index) => {
                        listType.forEach((item) => {
                            item.type = listTypes[index]
                        })
                    })
                    var allItems = items[0].concat(items[1], items[2], items[3], items[4])
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
                    console.log(items)
                    res.send(items)
                })
                .catch(function(err) {
                    console.log('error with search media', err)
                    res.status(400).send('Bad search')
                })
            } else {
                console.log('something went wrong')
            }
        })
        .catch(function(err) {
            console.log('error with token', err)
            res.status(400).send('Invalid user token')
        })
}