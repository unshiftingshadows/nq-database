const admin = require('firebase-admin')

const nqAccount = require('./nq_credentials.json')
const builderAccount = require('./real_credentials.json')

var nqApp = admin.initializeApp({
    credential: admin.credential.cert(nqAccount),
    databaseURL: 'https://notes-and-quotes-977a3.firebaseio.com'
}, 'nq')

var realApp = admin.initializeApp({
    credential: admin.credential.cert(builderAccount),
    databaseURL: 'https://real-45953.firebaseio.com'
}, 'real')

function nqVerifyID (idToken) {
    return nqApp.auth().verifyIdToken(idToken)
}

function realVerifyID (idToken) {
    return realApp.auth().verifyIdToken(idToken)
}

module.exports = {
    nq: {
        verifyID: nqVerifyID
    },
    real: {
        verifyID: realVerifyID,
        db: realApp.database(),
        store: realApp.firestore(),
        auth: realApp.auth()
    }
}