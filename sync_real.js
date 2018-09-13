const admin = require('firebase-admin')

const realAccount = require('./real_credentials.json')
const devAccount = require('./real_dev_credentials.json')

const realApp = admin.initializeApp({
    credential: admin.credential.cert(realAccount),
    databaseURL: 'https://real-45953.firebaseio.com'
}, 'realApp')

const devApp = admin.initializeApp({
    credential: admin.credential.cert(devAccount),
    databaseURL: 'https://real-dev-7b60c.firebaseio.com'
}, 'devApp')

// Used for syncing users from prod to dev

// realApp.auth().getUserByEmail(email)
//     .then((userRecord) => {
//         console.log(userRecord.uid)
//         devApp.auth().createUser({
//             uid: userRecord.uid,
//             email: userRecord.email,
//             emailVerified: userRecord.emailVerified,
//             password: password
//         })
//     })

const collection = 'curriculumEdit'

realApp.firestore().collection(collection).get().then((querySnap) => {
    querySnap.forEach((doc) => {
        realApp.firestore().collection(collection).doc(doc.id).collection('lessons').get().then((lessonSnap) => {
            lessonSnap.forEach((lesson) => {
                lesson.ref.update({
                    devoOrder: ['1','2','3','4','5','6','7']
                })
            })
        })
    })
})

// const schema = {
//     curriculumEdit: {
//         lessons: {
//             devos: {
//                 structure: {},
//                 modules: {},
//                 sections: {}
//             },
//             guides: {
//                 structure: {},
//                 modules: {},
//                 sections: {}
//             },
//             review: {
//                 structure: {},
//                 modules: {},
//                 sections: {}
//             }
//         }
//     },
//     user: {}
// };

// var source = realApp.firestore();
// var destination = devApp.firestore();

// const copy = (sourceDBrep, destinationDBref, aux) => {
//     return Promise.all(Object.keys(aux).map((collection) => {
//         return sourceDBrep.collection(collection).get()
//             .then((data) => {
//                 let promises = [];
//                 data.forEach((doc) => {
//                     const data = doc.data();
//                     promises.push(
//                         destinationDBref.collection(collection).doc(doc.id).set(data).then((data) => {
//                             return copy(sourceDBrep.collection(collection).doc(doc.id),
//                                 destinationDBref.collection(collection).doc(doc.id),
//                                 aux[collection])
//                         })
//                     );
//                 })
//                 return Promise.all(promises);
//             })
//     }));
// };

// copy(source, destination, schema).then(() => {
//     console.log('copied');
// });