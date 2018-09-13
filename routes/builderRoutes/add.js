const Schema = require('mongoose').Schema

const config = require('../../real_config.js')
const firebase = require('../../firebase.js').real
const api_cred = require('../../api_cred.js')

const https = require('https')
const axios = require('axios')
const getVideoId = require('get-video-id')

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

function newContent (type, data) {
    switch (type) {
        case 'series':
            return new SeriesReal({title: data})
        // case 'oseries':
        //     return new SeriesOther({title: data})
        // case 'olesson':
        //     return new LessonOther({title: data})
        // case 'osermon':
        //     return new SermonOther({title: data})
        // case 'oscratch':
        //     return new ScratchOther({title: data})
        default:
            return false
    }
}

// function parseDuration (duration) {
//     var a = duration.match(/\d+/g)
//     if (duration.indexOf('M') >= 0 && duration.indexOf('H') === -1 && duration.indexOf('S') === -1) {
//       a = [0, a[0], 0]
//     }
//     if (duration.indexOf('H') >= 0 && duration.indexOf('M') === -1) {
//       a = [a[0], 0, a[1]]
//     }
//     if (duration.indexOf('H') >= 0 && duration.indexOf('M') === -1 && duration.indexOf('S') === -1) {
//       a = [a[0], 0, 0]
//     }
//     duration = 0
//     if (a.length === 3) {
//       duration = duration + parseInt(a[0]) * 3600
//       duration = duration + parseInt(a[1]) * 60
//       duration = duration + parseInt(a[2])
//     }
//     if (a.length === 2) {
//       duration = duration + parseInt(a[0]) * 60
//       duration = duration + parseInt(a[1])
//     }
//     if (a.length === 1) {
//       duration = duration + parseInt(a[0])
//     }
//     return duration
// }

module.exports = function (req, res) {
    console.log('--builder add run--')
    console.log('type', req.body.type)
    console.log('resource data', req.body.data)
    var token = req.body.token
    
    firebase.verifyID(token)
        .then(function(decodedToken) {
            console.log('good!')
            var type = req.body.type
            var data = req.body.data
            var obj = newContent(type, data.title)
            obj.createdBy = decodedToken.uid
            obj.users = [decodedToken.uid]
            if (!obj) res.status(400).send('Problem...')
            obj.save(function (err, updated) {
                console.log(err)
                if (err) res.status(400).send('Could not save')
                if (type === 'series') {
                    // Add database reference to Firebase
                    var roles = {}
                    roles[decodedToken.uid] = 'admin'
                    console.log('before add store', updated._id, firebase.store)
                    var ref = firebase.store.collection('curriculumEdit').doc(updated._id)
                    console.log('ref', ref)
                    // ref.set({
                    //     title: data.title,
                    //     mainIdea: '',
                    //     roles: roles,
                    //     lessonOrder: []
                    // }).then(() => {
                    //     res.send(updated)
                    // }).catch((err) => {
                    //     console.log(err)
                    // });
                } else {
                    res.status(400).send('Incorrect content type...')
                }
                // res.send(updated)
            })
        })
        .catch(function(err) {
            console.log('error with token')
            console.log(err)
            res.status(400).send('Invalid user token')
        })
}