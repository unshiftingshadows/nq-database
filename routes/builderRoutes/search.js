const config = require('../../real_config.js')
const firebase = require('../../firebase.js').builder
const Fuse = require('fuse.js')

// Import media types
const SeriesReal = require('../../models/builderModels/models-real/Series.js')
const SeriesOther = require('../../models/builderModels/models-other/Series.js')
const LessonOther = require('../../models/builderModels/models-other/Lesson.js')

const Topic = require('../../models/nqModels/Topic.js')

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
            } else {
                console.log('something went wrong')
            }
        })
}