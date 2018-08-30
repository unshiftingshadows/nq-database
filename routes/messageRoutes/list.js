const config = require('../../real_config.js')
const firebase = require('../../firebase.js').real

// Import media types
// const SeriesReal = require('../../models/builderModels/models-real/Series.js')
const SeriesOther = require('../../models/messageModels/Series.js')
const LessonOther = require('../../models/messageModels/Lesson.js')
const SermonOther = require('../../models/messageModels/Sermon.js')
const ScratchOther = require('../../models/messageModels/Scratch.js')
const ArchiveOther = require('../../models/messageModels/Archive.js')

const Topic = require('../../models/nqModels/Topic.js')

// Import other media types
const Quote = require('../../models/messageModels/Quote.js')
const Image = require('../../models/messageModels/Image.js')
const Illustration = require('../../models/messageModels/Illustration.js')
const Lyric = require('../../models/messageModels/Lyric.js')
const Video = require('../../models/messageModels/Video.js')

// const realContent = {
//     'rseries': SeriesReal
// }

const otherContent = {
    'series': SeriesOther,
    'lesson': LessonOther,
    'sermon': SermonOther,
    'scratch': ScratchOther,
    'archive': ArchiveOther
}

const otherMedia = {
    'quote': Quote,
    'image': Image,
    'illustration': Illustration,
    'lyric': Lyric,
    'video': Video
}

module.exports = function (req, res) {
    console.log('--message list run--')
    console.log('type', req.body.type)
    var token = req.body.token
    
    firebase.verifyID(token)
        .then(function(decodedToken) {
            var type = req.body.type
            console.log('uid', decodedToken.uid)
            if (Object.keys(otherContent).includes(type)) {
                otherContent[type].find({ users: decodedToken.uid }).exec(function (err, items) {
                    if (err) console.log(err)
                    console.log(items)
                    res.send(items)
                })
            } else if (type === 'topic') {
                Topic.find({}).exec(function (err, items) {
                    if (err) console.log(err)
                    console.log(items)
                    res.send(items)
                })
            } else if (Object.keys(otherMedia).includes(type)) {
                otherMedia[type].find({ user: decodedToken.uid }).exec(function (err, items) {
                    if (err) console.log(err)
                    console.log(items)
                    res.send(items)
                })
            } else {
                console.log('something went wrong')
            }
        })
}