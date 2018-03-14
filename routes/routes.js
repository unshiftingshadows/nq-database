const app = require('express')()
const bodyParser = require('body-parser')

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Import route functions
const list = require('./list.js')
const view = require('./view.js')
const snippets = require('./snippets.js')
const add = require('./add.js')
const update = require('./update.js')
const lookup = require('./lookup.js')
const resources = require('./resources.js')

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

app.get('/', function (req, res) {
    res.send('hello world')
})

app.post('/list', list)
app.post('/add', add)
// app.post('/remove', remove)
app.post('/view', view)
app.post('/snippets', snippets)
app.post('/update', update)
app.post('/lookup', lookup)
app.post('/resources', resources)

module.exports = app