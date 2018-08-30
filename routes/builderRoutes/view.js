const config = require('../../real_config.js')
const firebase = require('../../firebase.js').real
const ObjectId = require('mongoose').Types.ObjectId

// Import media types
const SeriesReal = require('../../models/builderModels/Series.js')
// const SeriesOther = require('../../models/builderModels/models-other/Series.js')
// const LessonOther = require('../../models/builderModels/models-other/Lesson.js')
// const SermonOther = require('../../models/builderModels/models-other/Sermon.js')
// const ScratchOther = require('../../models/builderModels/models-other/Scratch.js')
// const ArchiveOther = require('../../models/messageModels/Archive.js')

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

const UserData = require('../../models/nqModels/UserData.js')

var realContent = {
    'series': SeriesReal
}

// var otherContent = {
//     'oseries': SeriesOther,
//     'olesson': LessonOther,
//     'osermon': SermonOther,
//     'oscratch': ScratchOther,
//     'oarchive': ArchiveOther
// }

var mediaTypes = {
    'book': Book,
    'movie': Movie,
    'image': Image,
    'video': Video,
    'article': Article,
    'note': Note,
    'document': Doc,
    'discourse': Discourse,
    'composition': Composition
}

var snippetTypes = {
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

module.exports = function (req, res) {
    console.log('--builder view run--')
    console.log('type', req.body.type)
    console.log('id', req.body.id)
    var token = req.body.token
    
    firebase.verifyID(token)
        .then(function(decodedToken) {
            var type = req.body.type
            console.log('uid', decodedToken.uid)
            if (Object.keys(realContent).includes(type)) {
                realContent[type].findOne({ _id: req.body.id }).exec(function (err, items) {
                    if (err) console.log(err)
                    console.log(items)
                    res.send(items)
                })
            } else if (Object.keys(mediaTypes).includes(type)) {
                mediaTypes[type].findOne({ _id: req.body.id }).exec(function (err, items) {
                    if (err) console.log(err)
                    console.log(items)
                    if (type === 'note') {
                        res.send({
                            resource: items
                        })
                    } else {
                        UserData.find({ resource: ObjectId(req.body.id) }).exec(function (err, data) {
                            console.log('data', data)
                            res.send({
                                resource: items,
                                userData: data
                            })
                        })
                    }
                })
            } else if (Object.keys(snippetTypes).includes(type)) {
                snippetTypes[type].findOne({ _id: req.body.id }).populate({ path: 'mediaid', select: 'title author thumbURL' }).exec(function (err, items) {
                    if (err) console.log(err)
                    console.log(items)
                    res.send({
                        resource: items
                    })
                })
            } else {
                console.log('something went wrong - NQ')
            }
        })
}