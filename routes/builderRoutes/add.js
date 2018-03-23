const Schema = require('mongoose').Schema

const config = require('../../real_config.js')
const firebase = require('../../firebase.js').builder

// Import media types
const SeriesReal = require('../../models/builderModels/models-real/Series.js')
const SeriesOther = require('../../models/builderModels/models-other/Series.js')
const LessonOther = require('../../models/builderModels/models-other/Lesson.js')

function newContent (type, data) {
    switch (type) {
        case 'rseries':
            return new SeriesReal(data)
        case 'oseries':
            return new SeriesOther(data)
        case 'olesson':
            return new LessonOther(data)
        default:
            return false
    }
}

module.exports = function (req, res) {
    console.log('type', req.body.type)
    console.log('resource data', req.body.data)
    var token = req.body.token
    
    firebase.verifyID(token)
        .then(function(decodedToken) {
            console.log('good!')
            var type = req.body.type
            var data = req.body.data
            data.user = decodedToken.uid
            var obj = newContent(type, data)
            if (!obj) res.status(400).send('Problem...')
            obj.save(function (err, updated) {
                console.log(err)
                if (err) res.status(400).send('Could not save')
                res.send(updated)
            })
        })
        .catch(function(err) {
            console.log('error with token')
            console.log(err)
            res.status(400).send('Invalid user token')
        })
}