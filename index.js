const router = require('./routes/routes.js')

const realMongoose = require('./db_connections/real-connect.js')
const otherMongoose = require('./db_connections/other-connect.js')
const nqMongoose = require('./db_connections/real-connect.js')

var realDB = realMongoose
realDB.on('error', console.error.bind(console, 'connection error:'))
realDB.once('open', function () {
    console.log('REAL DB - we are connected!!!')
})

var otherDB = otherMongoose
otherDB.on('error', console.error.bind(console, 'connection error:'))
otherDB.once('open', function () {
    console.log('Other DB - we are connected!!!')
})

var otherDB = nqMongoose
otherDB.on('error', console.error.bind(console, 'connection error:'))
otherDB.once('open', function () {
    console.log('Notes and Quotes - we are connected!!!')
})

const port = 8080

router.listen(port, () => console.log('Database listening on port: ' + port))