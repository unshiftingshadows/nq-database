const Schema = require('mongoose').Schema

const config = require('../../real_config.js')
const firebase = require('../../firebase.js').real

// Import media types
const SeriesReal = require('../../models/builderModels/Series.js')
// const SeriesOther = require('../../models/builderModels/models-other/Series.js')
// const LessonOther = require('../../models/builderModels/models-other/Lesson.js')
// const SermonOther = require('../../models/builderModels/models-other/Sermon.js')
// const ScratchOther = require('../../models/builderModels/models-other/Scratch.js')

// Import other media types
// const Quote = require('../../models/builderModels/models-other/Quote.js')
// const Image = require('../../models/builderModels/models-other/Image.js')
// const Illustration = require('../../models/builderModels/models-other/Illustration.js')
// const Lyric = require('../../models/builderModels/models-other/Lyric.js')
// const Video = require('../../models/builderModels/models-other/Video.js')

const mediaList = {
    'series': SeriesReal
    // 'oseries': SeriesOther,
    // 'olesson': LessonOther,
    // 'osermon': SermonOther,
    // 'oscratch': ScratchOther
}

// const otherMedia = {
//     'quote': Quote,
//     'image': Image,
//     'illustration': Illustration,
//     'lyric': Lyric,
//     'video': Video
// }

module.exports = function (req, res) {
    console.log('--builder update run--')
    console.log('type', req.body.type)
    console.log('id', req.body.id)
    console.log('resource data', req.body.data)
    var token = req.body.token
    
    firebase.verifyID(token)
        .then(function(decodedToken) {
            console.log('good!')
            var type = req.body.type
            var id = req.body.id
            var data = req.body.data
            if (Object.keys(mediaList).includes(type)) {
                mediaList[type].findById(id, function (err, item) {
                    console.log(err)
                    if (err) res.status(400).send('Error with update')
                    for (key in data) {
                        item[key] = data[key]
                        console.log('item: ', item[key])
                    }
                    item.save(function (err, updatedItem) {
                        if (err || updatedItem === null) {
                            console.log('Problem updating item')
                            res.status(400).send('Did not update')
                        } else {
                            console.log('updated!', updatedItem)
                            res.send(updatedItem)
                        }
                    })
                })
            } else {
                console.log('error with type')
                res.status(400).send('Invalid type')
            }
        })
        .catch(function(err) {
            console.log('error with token')
            console.log(err)
            res.status(400).send('Invalid user token')
        })
}