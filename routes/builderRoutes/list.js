const config = require('../../real_config.js')
const firebase = require('../../firebase.js').builder

// Import media types
const SeriesReal = require('../../models/builderModels/models-real/Series.js')
const SeriesOther = require('../../models/builderModels/models-other/Series.js')
const LessonOther = require('../../models/builderModels/models-other/Lesson.js')
const SermonOther = require('../../models/builderModels/models-other/Sermon.js')

const Topic = require('../../models/nqModels/Topic.js')

// Import other media types
const Quote = require('../../models/builderModels/models-other/Quote.js')
const Image = require('../../models/builderModels/models-other/Image.js')
const Illustration = require('../../models/builderModels/models-other/Illustration.js')
const Lyric = require('../../models/builderModels/models-other/Lyric.js')
const Video = require('../../models/builderModels/models-other/Video.js')

const realContent = {
    'rseries': SeriesReal
}

const otherContent = {
    'oseries': SeriesOther,
    'olessons': LessonOther,
    'osermons': SermonOther
}

const newMedia = {
    'quote': Quote,
    'image': Image,
    'illustration': Illustration,
    'lyric': Lyric,
    'video': Video
}

module.exports = function (req, res) {
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
            } else if (Object.keys(realContent).includes(type)) {
                realContent[type].find({ users: decodedToken.uid }).exec(function (err, items) {
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
            } else if (Object.keys(newMedia).includes(type)) {
                newMedia[type].find({ user: decodedToken.uid }).exec(function (err, items) {
                    if (err) console.log(err)
                    console.log(items)
                    res.send(items)
                })
            } else {
                console.log('something went wrong')
            }
        })
}