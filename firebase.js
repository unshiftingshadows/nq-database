const admin = require('firebase-admin')

const serviceAccount = require('./nq_credentials.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://notes-and-quotes-977a3.firebaseio.com'
})

function verifyID (idToken) {
    return admin.auth().verifyIdToken(idToken)
}

module.exports = {
    verifyID: verifyID
}