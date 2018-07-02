const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const config = require('../../real_config.js')
const firebase = require('../../firebase.js').builder

// Import media types
const SeriesOther = require('../../models/builderModels/models-other/Series.js')
const LessonOther = require('../../models/builderModels/models-other/Lesson.js')
const SermonOther = require('../../models/builderModels/models-other/Sermon.js')
const ScratchOther = require('../../models/builderModels/models-other/Scratch.js')

const ArchiveOther = require('../../models/builderModels/models-other/Archive.js')

const mediaList = {
    'oseries': SeriesOther,
    'olesson': LessonOther,
    'osermon': SermonOther,
    'oscratch': ScratchOther
}

module.exports = function (req, res) {
    console.log('--builder archive run--')
    console.log('type', req.body.type)
    console.log('id', req.body.id)
    var token = req.body.token
    
    firebase.verifyID(token)
        .then(function(decodedToken) {
            console.log('good!')
            var type = req.body.type
            var id = req.body.id
            if (Object.keys(mediaList).includes(type)) {
                mediaList[type].findById(id, function (err, item) {
                    console.log(err)
                    if (err) res.status(400).send('Error with archive')
                    var obj = new ArchiveOther(item.toObject())
                    obj.isNew = true
                    obj.type = type.slice(1)
                    console.log('new archive obj', obj)
                    obj.save(function (err, newItem) {
                        if (err) {
                            console.log('Archive not added...', err)
                            res.status(400).send('Archive not added...')
                        } else {
                            mediaList[type].deleteOne({ _id: id }, function (err) {
                                if (err) {
                                    console.log('Media not deleted...', err)
                                    res.status(400).send('Media not deleted...')
                                } else {
                                    console.log('archived!')
                                    res.send(newItem)
                                }
                            })
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