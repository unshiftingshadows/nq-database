const router = require('./routes/routes.js')

const nqMongoose = require('./db_connections/nq-connect.js')
const realMongoose = require('./db_connections/real-connect.js')
const otherMongoose = require('./db_connections/other-connect.js')

var nqDB = nqMongoose
nqDB.on('error', console.error.bind(console, 'connection error:'))
nqDB.once('open', function () {
    console.log('Notes and Quotes - we are connected!!!')
})

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

const port = 8080

router.listen(port, () => console.log('Database listening on port: ' + port))