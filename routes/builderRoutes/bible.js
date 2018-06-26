const config = require('../../real_config.js')
const firebase = require('../../firebase.js').builder
const bcv_parser = require('bible-passage-reference-parser/js/en_bcv_parser').bcv_parser
const htmlToText = require('html-to-text')

const axios = require('axios')

const api_cred = require('../../api_cred.js')

const versionList = {
    'esv': getESV,
    'kjv': getDBP,
    'nas': getDBP,
    'nkj': getDBP,
    'asv': getDBP,
    'web': getDBP,
    'niv': getDBP,
    'net': getNET,
    'leb': getBiblia,
    'nlt': getNLT
}

const otBooks = ['Gen', 'Exod', 'Lev', 'Num', 'Deut', 'Josh', 'Judg', 'Ruth', '1Sam', '2Sam', '1Kgs', '2Kgs', '1Chr', '2Chr', 'Ezra', 'Neh', 'Esth', 'Job', 'Ps', 'Prov', 'Eccl', 'Song', 'Isa', 'Jer', 'Lam', 'Ezek', 'Dan', 'Hos', 'Joel', 'Amos', 'Obad', 'Jonah', 'Mic', 'Nah', 'Hab', 'Zeph', 'Hag', 'Zech', 'Mal']
const ntBooks = ['Matt', 'Mark', 'Luke', 'John', 'Acts', 'Rom', '1Cor', '2Cor', 'Gal', 'Eph', 'Phil', 'Col', '1Thess', '2Thess', '1Tim', '2Tim', 'Titus', 'Phlm', 'Heb', 'Jas', '1Pet', '2Pet', '1John', '2John', '3John', 'Jude', 'Rev']

function getESV (ref, version, res) {
    var bcv = new bcv_parser
    var parsedRef = bcv.parse(ref)
    console.log('parsed esv', parsedRef.osis())
    axios.get('https://api.esv.org/v3/passage/text/?q=' + parsedRef.osis(), {
        params: {
            'include-passage-references': false,
            'include-first-verse-numbers': false,
            'include-verse-numbers': false,
            'include-footnotes': false,
            'include-footnote-body': false,
            'include-short-copyright': false,
            'include-copyright': false,
            'include-passage-horizontal-lines': false,
            'include-heading-horizontal-lines': false,
            'include-headings': false
        },
        headers: {
            'Authorization': api_cred.esv
        }
    })
        .then((data) => {
            console.log(data)
            res.send({
                parse: parsedRef,
                text: data.data.passages.join('...')
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send('esv error')
        })
}

function getDBP (ref, version, res) {
    var ver = version.toUpperCase()
    var bcv = new bcv_parser
    var parsedRef = bcv.parse(ref)
    var otnt = otBooks.includes(parsedRef.osis().split('.')[0]) ? 'O' : ntBooks.includes(parsedRef.osis().split('.')[0]) ? 'N' : console.error('book not found, ot/nt')
    if (parsedRef.entities[0].type === 'sequence') {
        // Handle sequence of verses
        res.status(400).send('Sequences not part of server responses')
    } else if (parsedRef.entities[0].type === 'range') {
        // Handle range of verses
        console.log('dbp-range')
        if (parsedRef.entities[0].passages[0].start.b === parsedRef.entities[0].passages[0].end.b) {
            if (parsedRef.entities[0].passages[0].start.c === parsedRef.entities[0].passages[0].end.c) {
                var url = 'http://dbt.io/text/verse?key=' + api_cred.dbp + '&dam_id=ENG' + ver + otnt + '2ET&book_id=' + parsedRef.entities[0].passages[0].start.b + '&chapter_id=' + parsedRef.entities[0].passages[0].start.c + '&verse_start=' + parsedRef.entities[0].passages[0].start.v + '&verse_end=' + parsedRef.entities[0].passages[0].end.v + '&v=2'
                // console.log('url', url)
                axios.get(url)
                    .then((data) => {
                        console.log('dbp-data', data.data.map(e => { return e.verse_text }).join(' '))
                        res.send({
                            parse: parsedRef,
                            text: data.data.map(e => { return e.verse_text }).join(' ')
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                        res.status(400).send('dbp error')
                    })
            } else {
                var currentChapter = parsedRef.entities[0].passages[0].start.c
                var queries = []
                queries.push(axios.get('http://dbt.io/text/verse?key=' + api_cred.dbp + '&dam_id=ENG' + ver + otnt + '2ET&book_id=' + parsedRef.entities[0].passages[0].start.b + '&chapter_id=' + parsedRef.entities[0].passages[0].start.c + '&verse_start=' + parsedRef.entities[0].passages[0].start.v + '&verse_end=1000&v=2'))
                currentChapter++
                for (; currentChapter < parsedRef.entities[0].passages[0].end.c; currentChapter++) {
                    console.log('loop for chapter ' + currentChapter)
                    var url = 'http://dbt.io/text/verse?key=' + api_cred.dbp + '&dam_id=ENG' + ver + otnt + '2ET&book_id=' + parsedRef.entities[0].passages[0].start.b + '&chapter_id=' + currentChapter + '&v=2'
                    // console.log('url', url)
                    queries.push(axios.get(url))
                }
                queries.push(axios.get('http://dbt.io/text/verse?key=' + api_cred.dbp + '&dam_id=ENG' + ver + otnt + '2ET&book_id=' + parsedRef.entities[0].passages[0].start.b + '&chapter_id=' + parsedRef.entities[0].passages[0].end.c + '&verse_start=1&verse_end=' + parsedRef.entities[0].passages[0].end.v + '&v=2'))
                axios.all(queries)
                    .then(axios.spread((...args) => {
                        res.send({
                            parse: parsedRef,
                            text: args.map(e => { return e.data.map(f => { return f.verse_text }).join(' ') }).join(' ')
                        })
                    }))
            }
        } else {
            console.error('dbp: books in range don\'t match...')
        }
    } else if (parsedRef.entities[0].type === 'bcv') {
        // Handle individual verse
        var url = 'http://dbt.io/text/verse?key=' + api_cred.dbp + '&dam_id=ENG' + ver + otnt + '2ET&book_id=' + parsedRef.entities[0].passages[0].start.b + '&chapter_id=' + parsedRef.entities[0].passages[0].start.c + '&verse_start=' + parsedRef.entities[0].passages[0].start.v + '&v=2'
        // console.log('url', url)
        axios.get(url)
            .then((data) => {
                console.log('dbp-data', data.data.map(e => { return e.verse_text }).join(' '))
                res.send({
                    parse: parsedRef,
                    text: data.data.map(e => { return e.verse_text }).join(' ')
                })
            })
            .catch((err) => {
                console.log(err)
                res.status(400).send('dbp error')
            })
    }
    
}

function getNET (ref, version, res) {
    var bcv = new bcv_parser
    var parsedRef = bcv.parse(ref)
    var formattedRef = ''
    if (parsedRef.entities[0].type === 'sequence') {
        // Return sequenced ref
        res.status(400).send('Sequences not part of server responses')
    } else if (parsedRef.entities[0].type === 'range') {
        // Return range ref
        if (parsedRef.entities[0].passages[0].start.c === parsedRef.entities[0].passages[0].end.c) {
            formattedRef = parsedRef.entities[0].passages[0].start.b + '+' + parsedRef.entities[0].passages[0].start.c + '.' + parsedRef.entities[0].passages[0].start.v + '-' + parsedRef.entities[0].passages[0].end.v
        } else {
            formattedRef = parsedRef.entities[0].passages[0].start.b + '+' + parsedRef.entities[0].passages[0].start.c + '.' + parsedRef.entities[0].passages[0].start.v + '-' + parsedRef.entities[0].passages[0].end.c + '.' + parsedRef.entities[0].passages[0].end.v
        }
    } else if (parsedRef.entities[0].type === 'bcv') {
        // Return formatted ref
        formattedRef = parsedRef.osis().split('.')[0] + '+' + parsedRef.osis().split('.').slice(1).join('.')
    }
    console.log(formattedRef)
    axios.get('http://labs.bible.org/api/?passage=' + formattedRef + '&formatting=plain')
        .then((data) => {
            console.log('net-data', data.data)
            var text = data.data.replace(/\d:\d+ /g, '')
            text = text.replace(/ +\d+/g, '')
            res.send({
                parse: parsedRef,
                text: text
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send('net-error')
        })
}

function getBiblia (ref, version, res) {
    var ver = version.toUpperCase()
    var bcv = new bcv_parser
    var parsedRef = bcv.parse(ref)
    axios.get('https://api.biblia.com/v1/bible/content/' + ver + '.html?passage=' + parsedRef.osis() + '&key=' + api_cred.biblia + '&style=bibleTextOnly')
        .then((data) => {
            console.log('leb-data', data.data)
            res.send({
                parse: parsedRef,
                text: htmlToText.fromString(data.data)
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send('leb-error')
        })
}

function getNLT (ref, version, res) {
    var ver = version.toUpperCase()
    var bcv = new bcv_parser
    var parsedRef = bcv.parse(ref)
    axios.get('http://api.nlt.to/api/passages?ref=' + parsedRef.osis())
        .then((data) => {
            console.log('nlt-data', data.data)
            console.log(htmlToText.fromString(data.data))
            // res.send({
            //     parse: parsedRef,
            //     text: htmlToText.fromString(data.data)
            // })
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send('nlt-error')
        })
}

module.exports = function (req, res) {
    console.log('--builder bible run--')
    console.log('ref', req.body.ref)
    console.log('version', req.body.version)
    var token = req.body.token
    
    firebase.verifyID(token)
        .then(function(decodedToken) {
            console.log('good!')
            if (Object.keys(versionList).includes(req.body.version)) {
                versionList[req.body.version](req.body.ref, req.body.version, res)
            } else {
                res.status(400).send('Invalid version')
            }
        })
        .catch(function(err) {
            console.log('error with token')
            console.log(err)
            res.status(400).send('Invalid user token')
        })
}