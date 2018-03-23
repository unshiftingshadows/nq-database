const config = require('../../real_config.js')
const firebase = require('../../firebase.js').builder

// Import media types
const SeriesReal = require('../../models/builderModels/models-real/Series.js')
const SeriesOther = require('../../models/builderModels/models-other/Series.js')
const LessonOther = require('../../models/builderModels/models-other/Lesson.js')

var realContent = {
    'rseries': SeriesReal
}

var otherContent = {
    'oseries': SeriesOther,
    'olessons': LessonOther
}

module.exports = function (req, res) {
    console.log('type', req.body.type)
    var token = req.body.token
    
    firebase.verifyID(token)
        .then(function(decodedToken) {
            var type = req.body.type
            console.log('uid', decodedToken.uid)
            if (Object.keys(otherContent).includes(type)) {
                otherContent[type].find({}).where('user', decodedToken.uid).exec(function (err, items) {
                    if (err) console.log(err)
                    console.log(items)
                    res.send(items)
                })
            } else if (Object.keys(realContent).includes(type)) {
                realContent[type].find({}).where('user', decodedToken.uid).exec(function (err, items) {
                    if (err) console.log(err)
                    console.log(items)
                    res.send(items)
                })
            } else {
                console.log('something went wrong')
            }
        })
}