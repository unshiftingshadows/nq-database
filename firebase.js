const admin = require('firebase-admin')

const nqAccount = require('./nq_credentials.json')
const builderAccount = require('./builder_credentials.json')

var nqApp = admin.initializeApp({
    credential: admin.credential.cert(nqAccount),
    databaseURL: 'https://notes-and-quotes-977a3.firebaseio.com'
}, 'nq')

var builderApp = admin.initializeApp({
    credential: admin.credential.cert(builderAccount),
    databaseURL: 'https://real-curriculum-builder.firebaseio.com'
}, 'builder')

function nqVerifyID (idToken) {
    return nqApp.auth().verifyIdToken(idToken)
}

function builderVerifyID (idToken) {
    return builderApp.auth().verifyIdToken(idToken)
}

module.exports = {
    nq: {
        verifyID: nqVerifyID
    },
    builder: {
        verifyID: builderVerifyID,
        db: builderApp.database(),
        auth: builderApp.auth()
    }
}