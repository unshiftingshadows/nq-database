const config = require('../nq_config.js')
const firebase = require('../firebase.js')
const https = require('https')

const api_cred = require('../api_cred.js')

function book (searchTerm, callback) {
    // Return google results
    // var xhttp = new XMLHttpRequest()
    // xhttp.onreadystatechange = (state) => {
    //     if (state.currentTarget.readyState === 4 && state.currentTarget.status === 200) {
    //         var results = JSON.parse(xhttp.responseText)
    //         console.log(results)
    //         callback(results)
    //     }
    // }
    // xhttp.open('GET', 'https://www.googleapis.com/books/v1/volumes?q=' + searchTerm, true)
    // xhttp.send()

    https.get('https://www.googleapis.com/books/v1/volumes?q=' + searchTerm, (res) => {
        let data = ''
        res.on('data', (chunk) => {
            data += chunk
        })
        res.on('end', () => {
            var results = JSON.parse(data)
            console.log(results)
            callback(results)
        })
    }).on('error', (err) => {
        console.log('Error: ' + err.message)
    })
}

function movie (searchTerm, callback) {
    https.get('https://api.themoviedb.org/3/search/movie?include_adult=false&page=1&language=en-US&api_key=' + api_cred.moviedb + '&query=' + searchTerm, (res) => {
        let data = ''
        res.on('data', (chunk) => {
            data += chunk
        })
        res.on('end', () => {
            var results = JSON.parse(data)
            console.log(results)
            callback(results)
        })
    }).on('error', (err) => {
        console.log('Error: ' + err.message)
    })
}

module.exports = function (req, res) {
    console.log('type', req.body.type)
    console.log('search term', req.body.searchTerm)
    var token = req.body.token

    firebase.verifyID(token)
        .then(function(decodedToken) {
            var type = req.body.type
            var searchTerm = req.body.searchTerm
            switch (type) {
                case 'book':
                    book(searchTerm, (results) => {
                        res.status(200).send(results)
                    })
                    break
                case 'movie':
                    movie(searchTerm, (results) => {
                        res.status(200).send(results)
                    })
                    break
                default:
                    console.log('invalid type')
                    res.status(400).send('invalid type')
            }
        })
        .catch(function(err) {
            console.log('error with token')
            console.log(err)
            res.status(400).send('Invalid user token')
        })
}