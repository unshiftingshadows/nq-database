const config = require('../../real_config.js')
const firebase = require('../../firebase.js').real
const bcv_parser = require('bible-passage-reference-parser/js/en_bcv_parser').bcv_parser
const htmlToText = require('html-to-text')

const axios = require('axios')

const api_cred = require('../../api_cred.js')

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

module.exports = function (req, res) {
    console.log('--builder bible run--')
    console.log('ref', req.body.ref)
    console.log('version', req.body.version)
    var token = req.body.token
    
    firebase.verifyID(token)
        .then(function(decodedToken) {
            console.log('good!')
            if (req.body.version === 'esv') {
                getESV(req.body.ref, req.body.version, res)
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