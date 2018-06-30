const config = require('../../real_config.js')
const firebase = require('../../firebase.js').builder
const api_cred = require('../../api_cred.js')
const mailgun = require('mailgun-js')({apiKey: api_cred.mailgun, domain: 'mail.real-curriculum.com'})
const request = require('superagent')
// const mailchimp = require('mailchimp-node')(api_cred.mailchimp)

module.exports = function (req, res) {
    console.log('--builder user run--')
    console.log('request', req.query)
    const action = req.query.action
    // TODO: Check for admin uid before adding/deleting users
    switch (action) {
        case 'add':
        console.log('start add user')
        var randompass = Math.random().toString(36).slice(-8);
        firebase.auth.createUser({
            email: req.query.email,
            emailVerified: true,
            password: randompass
        }).then(function(newUser) {
            var data = {
                from: 'REAL Builder <builder@real-curriculum.com>',
                to: req.query.email,
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
            //         email: req.query.email,
            //         status: 'subscriber',
            //         merge_fields: {
            //             'FNAME': req.query.first,
            //             'LNAME': req.query.last
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
                    'email_address': req.query.email,
                    'status': 'subscribed',
                    'merge_fields': {
                        'FNAME': req.query.first,
                        'LNAME': req.query.last
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
            firebase.db.ref('/users/' + newUser.uid).set({
                email: req.query.email,
                name: {
                    first: req.query.first,
                    last: req.query.last
                },
                newUser: true,
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
                realUser: false,
                theme: 'light'
            }).then(function() {
                res.send('New user created!')
            }).catch(function(error) {
                console.log('Error saving new user: ', error)
                res.status(400).send('Error saving new user')
            })
            })
            break
        default:
            console.error('invalid user action')
    }
}