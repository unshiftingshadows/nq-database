const app = require('express')()
const bodyParser = require('body-parser')

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Import Notes and Quotes route functions
const nqlist = require('./nqRoutes/list.js')
const nqview = require('./nqRoutes/view.js')
const nqsnippets = require('./nqRoutes/snippets.js')
const nqadd = require('./nqRoutes/add.js')
const nqupdate = require('./nqRoutes/update.js')
const nqlookup = require('./nqRoutes/lookup.js')
const nqresources = require('./nqRoutes/resources.js')

// Import Builder route functions
const messagelist = require('./messageRoutes/list.js')
const messageadd = require('./messageRoutes/add.js')
const messagearchive = require('./messageRoutes/archive.js')
const messageview = require('./messageRoutes/view.js')
const messageupdate = require('./messageRoutes/update.js')
const messagesearch = require('./messageRoutes/search.js')
const messagebible = require('./messageRoutes/bible.js')
const messageresources = require('./messageRoutes/resources.js')
const messageresearch = require('./messageRoutes/research.js')
const messagepoll = require('./messageRoutes/poll.js')

// Import Builder route functions
const builderlist = require('./builderRoutes/list.js')
const builderadd = require('./builderRoutes/add.js')
const builderview = require('./builderRoutes/view.js')
const builderupdate = require('./builderRoutes/update.js')
const buildersearch = require('./builderRoutes/search.js')
const builderbible = require('./builderRoutes/bible.js')
const builderresources = require('./builderRoutes/resources.js')
const builderresearch = require('./builderRoutes/research.js')

// Import REAL route functions
const realUser = require('./realRoutes/user.js')

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

app.get('/', function (req, res) {
    res.send('Welcome to Unshifting Shadows Database')
})

app.get('/nq', function (req, res) {
    res.send('Notes and Quotes...info coming soon')
})

// NQ Routes
app.post('/nq/list', nqlist)
app.post('/nq/add', nqadd)
// app.post('/nq/remove', nqremove)
app.post('/nq/view', nqview)
app.post('/nq/snippets', nqsnippets)
app.post('/nq/update', nqupdate)
app.post('/nq/lookup', nqlookup)
app.post('/nq/resources', nqresources)

app.get('/message', function (req, res) {
    res.send('REAL Message...info coming soon')
})

// Builder Routes
app.post('/message/list', messagelist)
app.post('/message/add', messageadd)
app.post('/message/archive', messagearchive)
// app.post('/message/remove', messageremove)
app.post('/message/view', messageview)
app.post('/message/update', messageupdate)
app.post('/message/search', messagesearch)
app.post('/message/bible', messagebible)
app.post('/message/resources', messageresources)
app.post('/message/research', messageresearch)
app.post('/message/poll', messagepoll)

app.get('/builder', function (req, res) {
    res.send('REAL Builder...info coming soon')
})

// Builder Routes
app.post('/builder/list', builderlist)
app.post('/builder/add', builderadd)
app.post('/builder/view', builderview)
app.post('/builder/update', builderupdate)
app.post('/builder/search', buildersearch)
app.post('/builder/bible', builderbible)
app.post('/builder/resources', builderresources)
app.post('/builder/research', builderresearch)
// app.post('/builder/poll', builderpoll)

app.get('/real', function (req, res) {
    res.send('REAL...info coming soon')
})

// REAL Routes
app.post('/real/user', realUser)

module.exports = app