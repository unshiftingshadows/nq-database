const  Schema = require('mongoose').Schema

const config = require('../nq_config.js')
const api_cred = require('../api_cred.js')
const firebase = require('../firebase.js')
const https = require('https')
const axios = require('axios')
const getVideoId = require('get-video-id')
const htmlToText = require('html-to-text')

// Import media types
const Book = require('../models/Book.js')
const Movie = require('../models/Movie.js')
const Image = require('../models/Image.js')
const Video = require('../models/Video.js')
const Article = require('../models/Article.js')
const Note = require('../models/Note.js')
const Quote = require('../models/Quote.js')
const Outline = require('../models/Outline.js')
const Idea = require('../models/Idea.js')
const Author = require('../models/Author.js')
const UserData = require('../models/UserData.js')
const Topic = require('../models/Topic.js')

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
                console.log(youtubeInfo)
                https.get('https://www.googleapis.com/youtube/v3/channels?key=' + api_cred.youtube + '&part=snippet&id=' + youtubeInfo.snippet.channelId, (res) => {
                    let data = ''
                    res.on('data', (chunk) => {
                        data += chunk
                    })
                    res.on('end', () => {
                        var channelInfo = JSON.parse(data).items[0]
                        console.log(channelInfo)
                        callback({
                            title: youtubeInfo.snippet.title,
                            author: [channelInfo.snippet.title],
                            authorURL: 'https://www.youtube.com/channel/' + channelInfo.id,
                            description: youtubeInfo.snippet.description,
                            duration: parseDuration(youtubeInfo.contentDetails.duration),
                            embedURL: 'https://www.youtube.com/embed/' + youtubeInfo.id,
                            embedHTML: youtubeInfo.player.embedHtml,
                            thumbURL: youtubeInfo.snippet.thumbnails.standard.url,
                            postDate: new Date(youtubeInfo.snippet.publishedAt),
                            source: 'youtube',
                            pageURL: videoURL,
                            videoID: youtubeInfo.id
                        })
                    })
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
                    author: [vimeoInfo.user.name],
                    authorURL: vimeoInfo.user.link,
                    description: vimeoInfo.description,
                    duration: vimeoInfo.duration,
                    embedURL: 'https://player.vimeo.com/video/' + videoInfo.id,
                    embedHTML: vimeoInfo.embed.html,
                    thumbURL: vimeoInfo.pictures.sizes[vimeoInfo.pictures.sizes.length - 1].link,
                    postDate: new Date(vimeoInfo.created_time),
                    source: 'vimeo',
                    pageURL: vimeoInfo.link,
                    videoID: videoInfo.id
                })
            })
        })
    }
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
            var author = htmlToText.fromString(imageInfo.extmetadata.Artist.value, {
                wordwrap: false
            })
            var href = ''
            if (imageInfo.extmetadata.Artist.value.match(/href="([^"]*)/) !== null) {
                href = imageInfo.extmetadata.Artist.value.match(/href="([^"]*)/)[1]
            }
            callback({
                title: title,
                author: [author],
                authorurl: 'https:' + href,
                thumbURL: imageInfo.thumburl,
                imageURL: imageInfo.url,
                postDate: new Date(imageInfo.extmetadata.DateTimeOriginal.value),
                credit: imageInfo.extmetadata.Credit.value,
                usageTerms: imageInfo.extmetadata.UsageTerms.value,
                description: imageInfo.extmetadata.ImageDescription.value,
                attributionRequired: imageInfo.extmetadata.AttributionRequired.value,
                pageURL: imageInfo.descriptionurl,
                source: 'wiki'
            })
        })
    })
}

function articleExtractor (articleURL, callback) {
    axios({
        method: 'get',
        url: 'https://mercury.postlight.com/parser?url=' + articleURL,
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'x-api-key': api_cred.mercury
        }
    }).then((res) => {
        console.log('response', res.data)
        var data = res.data
        // console.log(data)
        var text = htmlToText.fromString(data.content)
        console.log('article text', text)
        callback({
            title: data.title,
            author: data.author == null ? [] : [data.author],
            postDate: data.date_published == null ? new Date() : new Date(data.date_published),
            domain: data.domain,
            description: data.excerpt,
            thumbURL: data.lead_image_url,
            pageURL: data.url,
            wordCount: data.word_count,
            text: text,
            html: data.content
        })
    }).catch((err) => {
        console.log('something went wrong with the article')
        console.log(err)
    })
}

function newBook (data, uid, callback) {
    // Check for dup book
    Book.findOne({ 'googleid': data.googleid }).exec(function (err, dbBook) {
        console.log(dbBook)
        if (dbBook === null) {
            console.log('no error')
            https.get('https://www.googleapis.com/books/v1/volumes/' + data.googleid, (res) => {
                let data = ''
                res.on('data', (chunk) => {
                    data += chunk
                })
                res.on('end', () => {
                    var results = JSON.parse(data)
                    console.log(results)

                    var isbn = ''
                    results.volumeInfo.industryIdentifiers.forEach(function (iden) {
                        if (iden.type === 'ISBN_13') {
                        isbn = iden.identifier
                        }
                    })

                    var bookObj = {
                        title: results.volumeInfo.title,
                        author: results.volumeInfo.authors,
                        isbn: isbn,
                        publisher: results.volumeInfo.publisher,
                        pubYear: results.volumeInfo.publishedDate.split('-')[0],
                        thumbURL: results.volumeInfo.imageLinks.thumbnail,
                        googleid: results.id,
                        users: [uid]
                    }

                    var book = new Book(bookObj)
                    console.log(book)
                    book.save(function (err, updatedBook) {
                        console.log(err)
                        if (err) return callback(false)
                        console.log('book added and saved')
                        callback(updatedBook)
                    })
                })
            })
        } else {
            // TODO: Add user to existing book
            console.log('something went wrong in adding')
            console.log(err)
            callback(false)
        }
    })
}

function newImage (data, uid, callback) {
    switch (data.type) {
        case 'wiki':
            wikiImageSearch(data.title, (res) => {
                var image = new Image(res)
                image.users = [uid]
                console.log(image)
                image.save(function (err, updatedImage) {
                    console.log(err)
                    if (err) return callback(false)
                    console.log('added image and saved')
                    callback(updatedImage)
                })
            })
            break
        case 'link':
        case 'storage':
        default:
    }
}

function newVideo (data, uid, callback) {
    videoInfoSearch(data.url, (res) => {
        var video = new Video(res)
        video.users = [uid]
        console.log(video)
        video.save(function (err, updatedVideo) {
            console.log(err)
            if (err) return callback(false)
            console.log('added video and saved')
            callback(updatedVideo)
        })
    })
}

function newArticle (data, uid, callback) {
    articleExtractor(data.url, (res) => {
        var article = new Article(res)
        article.users = [uid]
        console.log(article)
        article.save(function (err, updatedArticle) {
            console.log(err)
            if (err) return callback(false)
            console.log('added article and saved')
            callback(updatedArticle)
        })
    })
}

function newNote (data, uid, callback) {
    console.log('started newNote')
    var obj = data
    obj.user = uid
    var note = new Note(obj)
    note.save(function(err, updatedNote) {
        console.log(err)
        if (err) return callback(false)
        callback(updatedNote)
    })
}

function newQuote (data, uid, callback) {
    console.log('started newQuote')
    var obj = data
    obj.user = uid
    var quote = new Quote(obj)
    quote.save(function (err, updatedQuote) {
        if (err) return callback(false)
        callback(updatedQuote)
    })
}

function newOutline (data, uid, callback) {
    console.log('started newOutline')
    var obj = data
    obj.user = uid
    var outline = new Outline(obj)
    outline.save(function (err, updatedOutline) {
        if (err) return callback(false)
        callback(updatedOutline)
    })
}

function newIdea (data, uid, callback) {
    console.log('started newIdea')
    var obj = data
    obj.user = uid
    var idea = new Idea(obj)
    idea.save(function (err, updatedIdea) {
        if (err) return callback(false)
        callback(updatedIdea)
    })
}

function newTopic (data, uid, callback) {
    console.log('started newTopic')
    var obj = data
    obj.users = [uid]
    var topic = new Topic(obj)
    topic.save(function (err, updatedTopic) {
        console.log(err)
        if (err) return callback(false)
        callback(updatedTopic)
    })
}

function newResource (data, uid, callback) {
    console.log('started newResource', data)
    var obj = data
    obj.addedBy = uid
    Topic.findOne({ _id: data.topic }).exec(function (err, topic) {
        console.log(err)
        if (err) callback(false)
        console.log(topic)
        delete obj.topic
        topic.resources.push(obj)
        topic.save(function (err, updatedTopic) {
            console.log(err)
            if (err) callback(false)
            console.log(updatedTopic)
            callback(updatedTopic)
        })
    })
}

var newMedia = {
    'book': newBook,
    // 'movie': newMovie,
    'image': newImage,
    'video': newVideo,
    'article': newArticle,
    'note': newNote,
    'quote': newQuote,
    'outline': newOutline,
    'idea': newIdea,
    'topic': newTopic,
    'resource': newResource
}

module.exports = function (req, res) {
    console.log('type', req.body.type)
    console.log('resource data', req.body.data)
    var token = req.body.token

    firebase.verifyID(token)
        .then(function(decodedToken) {
            var type = req.body.type
            var data = req.body.data
            if (config.mediaTypes.includes(type)) {
                newMedia[type](data, decodedToken.uid, (result) => {
                    if (!result) {
                        res.status(400).send('new media not added...')
                    } else {
                        res.status(200).send(result)
                    }
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