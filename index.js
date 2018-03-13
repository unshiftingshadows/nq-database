const router = require('./routes/routes.js')
const mongoose = require('mongoose')

const dbOptions = require('./db_cred.js')

const port = 8080

mongoose.connect('mongodb://localhost:27017/notesandquotes', dbOptions)
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log('we are connected!!!')
})

router.listen(port, () => console.log('Note and Quotes listening on port: ' + port))