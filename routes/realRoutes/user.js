const config = require('../../real_config.js')
const firebase = require('../../firebase.js').real
const api_cred = require('../../api_cred.js')
const mailgun = require('mailgun-js')({apiKey: api_cred.mailgun, domain: 'mail.real-curriculum.com'})
const request = require('superagent')
// const mailchimp = require('mailchimp-node')(api_cred.mailchimp)

module.exports = function (req, res) {
    console.log('--builder user run--')
    console.log('request', req.body)
    const action = req.body.action
    // TODO: Check for admin uid before adding/deleting users
    switch (action) {
        case 'add':
            console.log('start add user')
            var randompass = Math.random().toString(36).slice(-8);
            firebase.auth.createUser({
                email: req.body.email,
                emailVerified: true,
                password: randompass
            }).then(function(newUser) {
                var data = {
                    from: 'REAL Builder <builder@real-curriculum.com>',
                    to: req.body.email,
                    subject: 'New REAL Builder Account',
                    text: 'You now have a new builder account!\nYour new password is: ' + randompass + '\nLogin at builder.real-curriculum.com.'
                }
                mailgun.messages().send(data, function (error, body) {
                    console.log(error)
                    console.log(body)
                })
                // mailchimp.list.createMember(
                //     api_cred.builderListID,
                //     {
                //         email: req.body.email,
                //         status: 'subscriber',
                //         merge_fields: {
                //             'FNAME': req.body.first,
                //             'LNAME': req.body.last
                //         }
                //     },
                //     function(err, subscriber) {
                //         console.log(err)
                //         console.log(subscriber)
                //     }
                // )
                request.post('https://' + api_cred.mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + api_cred.builderListID + '/members/')
                    .set('Content-Type', 'application/json;charset=utf-8')
                    .set('Authorization', 'apikey ' + api_cred.mailchimp)
                    .send({
                        'email_address': req.body.email,
                        'status': 'subscribed',
                        'merge_fields': {
                            'FNAME': req.body.first,
                            'LNAME': req.body.last
                        }
                    })
                    .end(function(err,response) {
                        if (response.status < 300 || (response.status === 400 && response.body.title === 'Member Exists')) {
                            console.log('Signed up to MailChimp!')
                        } else {
                            console.error('MailChimp sign up failed...')
                            console.error(err)
                        }
                    })
                firebase.store.collection('user').doc(newUser.uid).set({
                    email: req.body.email,
                    name: {
                        first: req.body.first,
                        middle: '',
                        last: req.body.last
                    },
                    churchid: false,
                    churchRoles: {},
                    newUser: true,
                    nqUser: false,
                    prefs: {
                        theme: 'light',
                        bibleTranslation: 'nas',
                        message: {
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
                            },
                            osermonStructure: {
                                hook: true,
                                application: true,
                                prayer: true
                            },
                            olessonStructure: {
                                hook: true,
                                application: true,
                                prayer: true
                            },
                            structureNames: {
                                application: "Application",
                                hook: "Hook",
                                prayer: "Prayer"
                            },
                            speakingSpeed: 120
                        },
                        prayer: {},
                        curriculum: {},
                        database: {},
                        presenter: {},
                        service: {}
                    },
                    stats: {
                        lastPage: {
                            host: '',
                            path: ''
                        },
                        message: {
                            numsermon: 0,
                            numlesson: 0,
                            numscratch: 0,
                            numarchive: 0,
                            numquote: 0,
                            numimage: 0,
                            numvideo: 0,
                            numlyric: 0,
                            numillustration: 0
                        },
                        prayer: {},
                        curriculum: {},
                        database: {},
                        presenter: {},
                        service: {}
                    },
                    app: {
                        message: false,
                        prayer: false,
                        curriculum: false,
                        database: false,
                        presenter: false,
                        service: false
                    },
                    supportRestore: {
                        message: '',
                        prayer: '',
                        curriculum: '',
                        database: '',
                        presenter: '',
                        service: ''
                    },
                    realUser: false,
                    realRoles: {}
                }).then(function() {
                    res.send('New user created!')
                }).catch(function(error) {
                    console.log('Error saving new user: ', error)
                    res.status(400).send('Error saving new user')
                })
            })
            break
        case 'list':
            var pageToken = req.body.pageToken || undefined
            console.log('start list user')
            firebase.auth.listUsers(1000, pageToken).then((results) => {
                res.send(results)
            }).catch((error) => {
                console.log('Error listing all users: ', error)
                res.status(400).send('Error listing all users')
            })
            break
        default:
            console.error('invalid user action')
    }
}