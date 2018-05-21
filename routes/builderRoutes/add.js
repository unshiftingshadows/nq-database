const Schema = require('mongoose').Schema

const config = require('../../real_config.js')
const firebase = require('../../firebase.js').builder
const api_cred = require('../../api_cred.js')

const https = require('https')
const axios = require('axios')
const getVideoId = require('get-video-id')

// Import media types
const SeriesReal = require('../../models/builderModels/models-real/Series.js')
const SeriesOther = require('../../models/builderModels/models-other/Series.js')
const LessonOther = require('../../models/builderModels/models-other/Lesson.js')
const SermonOther = require('../../models/builderModels/models-other/Sermon.js')
const ScratchOther = require('../../models/builderModels/models-other/Scratch.js')

// Import other media types
const Quote = require('../../models/builderModels/models-other/Quote.js')
const Image = require('../../models/builderModels/models-other/Image.js')
const Illustration = require('../../models/builderModels/models-other/Illustration.js')
const Lyric = require('../../models/builderModels/models-other/Lyric.js')
const Video = require('../../models/builderModels/models-other/Video.js')

function newContent (type, data) {
    switch (type) {
        case 'rseries':
            return new SeriesReal({title: data})
        case 'oseries':
            return new SeriesOther({title: data})
        case 'olesson':
            return new LessonOther({title: data})
        case 'osermon':
            return new SermonOther({title: data})
        case 'oscratch':
            return new ScratchOther({title: data})
        default:
            return false
    }
}

function newQuote (data, uid, callback) {
    console.log('started newQuote')
    var obj = {
        text: data.data
    }
    obj.user = uid
    var quote = new Quote(obj)
    quote.save(function (err, updatedQuote) {
        if (err) return callback(false)
        callback(updatedQuote)
    })
}

function newIllustration (data, uid, callback) {
    console.log('started newIllustration')
    var obj = {
        title: data.data
    }
    obj.user = uid
    var illustration = new Illustration(obj)
    illustration.save(function (err, updatedIllustration) {
        if (err) return callback(false)
        callback(updatedIllustration)
    })
}

function newLyric (data, uid, callback) {
    console.log('started newLyric')
    var obj = {
        title: data.data
    }
    obj.user = uid
    var lyric = new Lyric(obj)
    lyric.save(function (err, updatedLyric) {
        if (err) return callback(false)
        callback(updatedLyric)
    })
}

function wikiImageSearch (title, callback) {
    // Get image info
    https.get('https://commons.wikimedia.org/w/api.php?action=query&origin=*&format=json&prop=imageinfo&titles=' + title + '&iiprop=extmetadata%7Curl&iilimit=10&iiurlwidth=250&callback=?', (res) => {
        let data = ''
        res.on('data', (chunk) => {
            data += chunk
        })
        res.on('end', () => {
            var results = JSON.parse(data.slice(5, data.length - 1))
            var imageInfo = results.query.pages[Object.keys(results.query.pages)[0]].imageinfo[0]
            console.log(imageInfo)
            callback({
                thumbURL: imageInfo.thumburl,
                imageURL: imageInfo.url,
                pageURL: imageInfo.descriptionurl,
                service: 'wiki'
            })
        })
    })
}

function newImage (data, uid, callback) {
    console.log('started newImage')
    switch (data.service) {
        case 'wiki':
            wikiImageSearch(data.data, (res) => {
                var image = new Image(res)
                image.user = uid
                console.log(image)
                image.save(function (err, updatedImage) {
                    console.log('image err', err)
                    if (err) return callback(false)
                    callback(updatedImage)
                })
            })
            break
        case 'link':
            data.imageURL = data.data
            data.thumbURL = data.data
            data.pageURL = data.data
            var image = new Image(data)
            image.user = uid
            console.log('link image', image)
        case 'upload':
            var image = new Image(data)
            image.user = uid
            console.log('upload image', image)
            image.save(function (err, updatedImage) {
                console.log('image err', err)
                if (err) return callback(false)
                callback(updatedImage)
            })
        default:
    }
}

function parseDuration (duration) {
    var a = duration.match(/\d+/g)
    if (duration.indexOf('M') >= 0 && duration.indexOf('H') === -1 && duration.indexOf('S') === -1) {
      a = [0, a[0], 0]
    }
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') === -1) {
      a = [a[0], 0, a[1]]
    }
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') === -1 && duration.indexOf('S') === -1) {
      a = [a[0], 0, 0]
    }
    duration = 0
    if (a.length === 3) {
      duration = duration + parseInt(a[0]) * 3600
      duration = duration + parseInt(a[1]) * 60
      duration = duration + parseInt(a[2])
    }
    if (a.length === 2) {
      duration = duration + parseInt(a[0]) * 60
      duration = duration + parseInt(a[1])
    }
    if (a.length === 1) {
      duration = duration + parseInt(a[0])
    }
    return duration
}

function videoInfoSearch (videoURL, callback) {
    // Get video info
    var videoInfo = getVideoId(videoURL)
    if (videoInfo.service === 'youtube') {
        https.get('https://www.googleapis.com/youtube/v3/videos?key=' + api_cred.youtube + '&part=snippet,contentDetails,player&id=' + videoInfo.id, (res) => {
            let data = ''
            res.on('data', (chunk) => {
                data += chunk
            })
            res.on('end', () => {
                var youtubeInfo = JSON.parse(data).items[0]
                console.log(youtubeInfo.snippet)
                callback({
                    title: youtubeInfo.snippet.title,
                    duration: parseDuration(youtubeInfo.contentDetails.duration),
                    embedURL: 'https://www.youtube.com/embed/' + youtubeInfo.id,
                    thumbURL: youtubeInfo.snippet.thumbnails.standard ? youtubeInfo.snippet.thumbnails.standard.url : youtubeInfo.snippet.thumbnails.high.url,
                    service: 'youtube',
                    pageURL: videoURL,
                    videoID: youtubeInfo.id
                })
            })
        })
    }
    else if (videoInfo.service === 'vimeo') {
        https.get('https://api.vimeo.com/videos/' + videoInfo.id + '?access_token=' + api_cred.vimeo, (res) => {
            let data = ''
            res.on('data', (chunk) => {
                data += chunk
            })
            res.on('end', () => {
                var vimeoInfo = JSON.parse(data)
                console.log(vimeoInfo)
                callback({
                    title: vimeoInfo.name,
                    duration: vimeoInfo.duration,
                    embedURL: 'https://player.vimeo.com/video/' + videoInfo.id,
                    thumbURL: vimeoInfo.pictures.sizes[vimeoInfo.pictures.sizes.length - 1].link,
                    service: 'vimeo',
                    pageURL: vimeoInfo.link,
                    videoID: videoInfo.id
                })
            })
        })
    }
}

function newVideo (data, uid, callback) {
    console.log('started newVideo')
    videoInfoSearch(data.data, (res) => {
        var video = new Video(res)
        video.user = uid
        console.log(video)
        video.save(function (err, updatedVideo) {
            console.log('video err', err)
            if (err) return callback(false)
            callback(updatedVideo)
        })
    })
}

const newMedia = {
    'quote': newQuote,
    'image': newImage,
    'illustration': newIllustration,
    'lyric': newLyric,
    'video': newVideo
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
            if (Object.keys(newMedia).includes(type)) {
                newMedia[type](data, decodedToken.uid, (item) => {
                    if (!item) {
                        res.status(400).send('new media not added...')
                    } else {
                        res.send(item)
                    }
                })
            } else {
                var obj = newContent(type, data.title)
                obj.createdBy = decodedToken.uid
                obj.users = [decodedToken.uid]
                if (!obj) res.status(400).send('Problem...')
                obj.save(function (err, updated) {
                    console.log(err)
                    if (err) res.status(400).send('Could not save')
                    if (type === 'olesson') {
                        // Add database reference to Firebase
                        firebase.db.ref('o/lessons/' + updated._id + '/structure/').set(config.initOLesson, function(err) {
                            if (err) {
                                console.log(err)
                            } else {
                                firebase.db.ref('o/lessons/' + updated._id + '/structure/hook').update({show: data.prefs.hook})
                                firebase.db.ref('o/lessons/' + updated._id + '/structure/application').update({show: data.prefs.application})
                                firebase.db.ref('o/lessons/' + updated._id + '/structure/prayer').update({show: data.prefs.prayer})
                                // Add template content to modules section
                                if (data.template !== 'blank') {
                                    firebase.db.ref('o/lessons/' + updated._id + '/modules/').set()
                                } else {
                                    res.send(updated)
                                }
                            }
                        });
                    } else if (type === 'osermon') {
                        // Add database reference to Firebase
                        firebase.db.ref('o/sermons/' + updated._id + '/structure/').set(config.initOSermon, function(err) {
                            if (err) {
                                console.log(err)
                            } else {
                                firebase.db.ref('o/sermons/' + updated._id + '/structure/hook').update({show: data.prefs.hook})
                                firebase.db.ref('o/sermons/' + updated._id + '/structure/application').update({show: data.prefs.application})
                                firebase.db.ref('o/sermons/' + updated._id + '/structure/prayer').update({show: data.prefs.prayer})
                                res.send(updated)
                            }
                        });
                    } else if (type === 'oscratch') {
                        res.send(updated)
                    } else if (type === 'rseries') {
                        // Add database reference to Firebase
                        var roles = {}
                        roles[decodedToken.uid] = 'admin'
                        firebase.db.ref('r/series/' + updated._id).set({
                            title: data.title,
                            mainIdea: '',
                            roles: roles
                        }, function(err) {
                            if (err) {
                                console.log(err)
                            } else {
                                res.send(updated)
                            }
                        });
                    } else {
                        res.status(400).send('Incorrect content type...')
                    }
                    // res.send(updated)
                })
            }
        })
        .catch(function(err) {
            console.log('error with token')
            console.log(err)
            res.status(400).send('Invalid user token')
        })
}