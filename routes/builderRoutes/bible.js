const config = require('../../real_config.js')
const firebase = require('../../firebase.js').builder

const axios = require('axios')

const api_cred = require('../../api_cred.js')

const versionList = {
    'esv': getESV
}

function getESV (ref, res) {
    axios.get('https://api.esv.org/v3/passage/text/?q=' + req.body.ref, {
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
            // console.log(data)
            res.send(data.data)
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send('esv error')
        })
}

module.exports = function (req, res) {
    console.log('ref', req.body.ref)
    console.log('version', req.body.version)
    var token = req.body.token
    
    firebase.verifyID(token)
        .then(function(decodedToken) {
            console.log('good!')
            if (Object.keys(versionList).includes(req.body.version)) {
                versionList(req.body.ref, res)
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