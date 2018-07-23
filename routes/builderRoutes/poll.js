const Schema = require('mongoose').Schema

const config = require('../../real_config.js')
const firebase = require('../../firebase.js').builder
const api_cred = require('../../api_cred.js')

const Poll = require('../../models/builderModels/models-other/Poll.js')
const PollResponse = require('../../models/builderModels/models-other/PollResponse.js')

function addPoll (data, callback) {
    var obj = new Poll(data)
    obj.save((err, newPoll) => {
        console.log('err', err)
        console.log('newPoll', newPoll)
        if (err) {
            console.log('add poll failed', err)
            callback(false)
        } else {
            console.log('Poll added!')
            callback(newPoll)
        }
    })
}

function updatePoll (data, callback) {
    Poll.findByIdAndUpdate(data._id, data, {new: true}, (err, newPoll) => {
        console.log('err', err)
        console.log('newPoll', newPoll)
        if (err) {
            console.log('update poll failed', err)
            callback(false)
        } else {
            console.log('Poll updated!')
            callback(newPoll)
        }
    })
}

function addResponse (data, uid, callback) {
    var obj = new PollResponse(data)
    obj.uid = uid
    obj.save((err, newResponse) => {
        if (err) {
            console.log('add response failed', err)
            callback(false)
        } else {
            console.log('Response added!')
            callback(newResponse)
        }
    })
}

function getPoll (id, callback) {
    Poll.findOne({ _id: id }).exec((err, pollDoc) => {
        if (err) {
            console.log('get poll failed', err)
            callback(false)
        } else {
            console.log('Got poll')
            callback(pollDoc)
        }
    })
}

function getCurrentPolls (uid, callback) {
    Poll.find({ users: { $ne: uid }, startDate: { $lt: new Date() }, endDate: { $gt: new Date() } }).exec((err, polls) => {
        if (err) {
            console.log('get current poll failed', err)
            callback(false)
        } else {
            console.log('Got current polls')
            callback(polls)
        }
    })
}

function getAllPolls (callback) {
    Poll.find().exec((err, polls) => {
        if (err) {
            console.log('get all poll failed', err)
            callback(false)
        } else {
            console.log('Got all polls')
            callback(polls)
        }
    })
}

function getResponses (id, callback) {
    PollResponse.find({ pollid: id }).exec((err, pollResponses) => {
        if (err) {
            console.log('get responses failed', err)
            callback(false)
        } else {
            console.log('Got responses')
            callback(pollResponses)
        }
    })
}

module.exports = function (req, res) {
    console.log('--builder poll run--')
    console.log('action', req.body.action)
    console.log('resource data', req.body.data)
    var token = req.body.token
    
    firebase.verifyID(token)
        .then(function(decodedToken) {
            console.log('good!')
            var action = req.body.action
            var data = req.body.data
            if (action === 'addPoll') {
                addPoll(data, (result) => {
                    if (result) {
                        res.send(result)
                    } else {
                        res.status(400).send('Add poll failed')
                    }
                })
            } else if (action === 'addResponse') {
                addResponse(data, decodedToken.uid, (result) => {
                    if (result) {
                        res.send(result)
                    } else {
                        res.status(400).send('Add response failed')
                    }
                })
            } else if (action === 'getPoll') {
                getPoll(data.pollid, (result) => {
                    if (result) {
                        res.send(result)
                    } else {
                        res.status(400).send('Get poll failed')
                    }
                })
            } else if (action === 'updatePoll') {
                updatePoll(data, (result) => {
                    if (result) {
                        res.send(result)
                    } else {
                        res.status(400).send('Update poll failed')
                    }
                })
            } else if (action === 'getCurrentPolls') {
                getCurrentPolls(decodedToken.uid, (result) => {
                    if (result) {
                        res.send(result)
                    } else {
                        res.status(400).send('Get current polls failed')
                    }
                })
            } else if (action === 'getAllPolls') {
                getAllPolls((result) => {
                    if (result) {
                        res.send(result)
                    } else {
                        res.status(400).send('Get all polls failed')
                    }
                })
            } else if (action === 'getResponses') {
                getResponses(data.pollid, (result) => {
                    if (result) {
                        res.send(result)
                    } else {
                        res.status(400).send('Get responses failed')
                    }
                })
            } else {
                console.log('Invalid action', action)
                res.status(400).send('Something went wrong...')
            }
        })
        .catch(function(err) {
            console.log('error with token')
            console.log(err)
            res.status(400).send('Invalid user token')
        })
}