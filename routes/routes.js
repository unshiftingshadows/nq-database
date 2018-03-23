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
const builderlist = require('./builderRoutes/list.js')
const builderadd = require('./builderRoutes/add.js')
const builderview = require('./builderRoutes/view.js')
const buildersearch = require('./builderRoutes/search.js')
const builderbible = require('./builderRoutes/bible.js')

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

app.get('/', function (req, res) {
    res.send('hello world')
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

app.get('/builder', function (req, res) {
    res.send('REAL Builder...info coming soon')
})

// Builder Routes
app.post('/builder/list', builderlist)
app.post('/builder/add', builderadd)
// app.post('/builder/remove', builderremove)
app.post('/builder/view', builderview)
app.post('/builder/search', buildersearch)
app.post('/builder/bible', builderbible)

module.exports = app