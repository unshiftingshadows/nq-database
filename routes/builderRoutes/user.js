const config = require('../../real_config.js')
const firebase = require('../../firebase.js').builder

function addUser(email, first, last, group, callback) {

}

module.exports = function (req, res) {
    const action = req.action
    switch (action) {
        case 'add':
            addUser(req.email, req.first, req.last, req.group, (response) => {
                firebase.auth.createUser({
                    email: req.email,
                    emailVerified: true
                }).then(function(newUser) {
                    firebase.db.ref('/users/' + newUser.uid).set({
                        email: req.email,
                        name: {
                            first: req.first,
                            last: req.last
                        },
                        nqUser: false,
                        prefs: {
                            bibleTranslation: 'nas',
                            contentType: {
                                lesson: true,
                                scratch: true,
                                sermon: true
                            },
                            mediaType: {
                                illustration: true,
                                image: true,
                                lyric: false,
                                quote: true,
                                video: true
                            }
                        },
                        realUser: false,
                        theme: 'light'
                    }).then(function() {
                        res.send('New user created!')
                    }).catch(function(error) {
                        console.log('Error saving new user: ', error)
                        res.status(400).send('Error saving new user')
                    })
                }).catch(function(error) {
                    console.log('Error creating new user: ', error)
                    res.status(400).send('Error creating new user')
                })
            })
            break
        default:
            console.error('invalid user action')
    }
}