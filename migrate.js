const admin = require('firebase-admin')
const bcv_parser = require('bible-passage-reference-parser/js/en_bcv_parser').bcv_parser
const bcv = new bcv_parser

// const builderAccount = require('./builder_credentials.json')
// const realAccount = require('./real_credentials.json')
const nqAccount = require('./nq_credentials.json')

// const builderApp = admin.initializeApp({
//     credential: admin.credential.cert(builderAccount),
//     databaseURL: 'https://real-curriculum-builder.firebaseio.com'
// }, 'builderApp')

// const realApp = admin.initializeApp({
//     credential: admin.credential.cert(realAccount),
//     databaseURL: 'https://real-45953.firebaseio.com'
// }, 'realApp')

const nqApp = admin.initializeApp({
    credential: admin.credential.cert(nqAccount),
    databaseURL: 'https://notes-and-quotes-977a3.firebaseio.com'
}, 'nqApp')

// var db = builderApp.database()

// var store = realApp.firestore()

var store = nqApp.firestore()

// db.ref('/o/lessons').once('value', (snap) => {
//     for (var sermon in snap.val()) {
//         store.collection('lesson').doc(sermon).set({}).then(ref => {
//             console.log('saved:', sermon)
//             for (var mod in snap.val()[sermon]['sections']) {
//                 var batch = store.batch()
//                 batch.set(store.collection('lesson').doc(sermon).collection(part).doc(mod), snap.val()[sermon][part][mod])
//                 batch.commit().then(() => {
//                     console.log('batch committed')
//                 })
//             }
//             for (var mod in snap.val()[sermon]['sectionModules']) {
//                 var batch = store.batch()
//                 batch.set(store.collection('lesson').doc(sermon).collection(part).doc(mod), snap.val()[sermon][part][mod])
//                 batch.commit().then(() => {
//                     console.log('batch committed')
//                 })
//             }
//             for (var mod in snap.val()[sermon]['structure']) {
//                 var batch = store.batch()
//                 batch.set(store.collection('lesson').doc(sermon).collection(part).doc(mod), snap.val()[sermon][part][mod])
//                 batch.commit().then(() => {
//                     console.log('batch committed')
//                 })
//             }
//         })
//     }
// })

const mongoose = require('mongoose')

const dbOptions = require('./db_cred.js').nq

mongoose.connect('mongodb://localhost:27017/notesandquotes', dbOptions)
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log('we are connected!!!')
})

// Add media models
const UserData = require('./models/nqModels/UserData.js')
// const Quote = require('./models/Quote.js')
// const Author = require('./models/Author.js')
// const UserData = require('./models/nqModels/UserData.js')

UserData.find({}).exec(function (err, items) {
    console.log('err: ', err)
    // console.log('items: ', items)
    items.forEach(item => {
        // var tempData = {}
        // tempData[item.uid] = item._id
        // Video.findOneAndUpdate({ _id: item.resource }, { userData: tempData }, function (err, updatedResource) {
        //     console.log('err: ', err)
        //     console.log('updatedResource: ', updatedResource)
        // })
        var tempData = item.toObject()
        // var id = tempData._id
        delete tempData._id
        delete tempData.uid
        delete tempData.resource
        delete tempData.type
        // delete tempData.userData
        delete tempData.__v
        // tempData.mediaid = tempData.mediaid.toString()
        // var bibleRefs = tempData.bibleRefs
        // tempData.bibleRefs = []
        // bibleRefs.forEach(ref => {
        //   if (ref.type === 'single') {
        //     tempData.bibleRefs.push(bcv.parse(ref.book + ' ' + ref.chapter + ':' + ref.verse).osis())
        //   } else if (ref.type === 'simpleRange') {
        //     tempData.bibleRefs.push(bcv.parse(ref.book + ' ' + ref.chapter + ':' + ref.verse + '-' + ref.verser).osis())
        //   } else if (ref.type === 'complexRange') {
        //     tempData.bibleRefs.push(bcv.parse(ref.book + ' ' + ref.chapter + ':' + ref.verse + '-' + ref.chapterr + ':' + ref.verser).osis())
        //   } else {
        //     console.error('Something went wrong with a Bible Ref...')
        //     return
        //   }
        // })
        // delete tempData.resources
        // delete tempData.bibleRefs
        // tempData.resources = []
        // tempData.bibleRefs = []
        console.log('resource', item.type, 'id', item.resource)
        store.collection(item.type + 's').doc(item.resource).update(tempData)
    })
})

// Books have been migrated!!
// Quotes have been migrated!!
// store.collection('books').get()
//     .then((snapshot) => {
//         // console.log(snapshot)
//         snapshot.forEach((book) => {
//             var bookData = book.data()
//             bookData.users = ['q5kqA2FRN3R9SaRIGwZbWUyrM9G2']
//             bookData.author = [bookData.author]
//             bookData.thumbURL = bookData.imageURL
//             bookData.allTags = Object.keys(bookData.allTags)
//             delete bookData.imageURL
//             delete bookData.userNotes
//             delete bookData.userTags
//             // console.log(bookData)
//             var newBook = new Book(bookData)
//             newBook.save(function (err, updatedBook) {
//                 console.log('error', err)
//                 console.log('final book data', updatedBook)
//                 store.collection('quotes').where('mediaid', '==', book.id).get()
//                 .then((quoteSnap) => {
//                     quoteSnap.forEach((quote) => {
//                         var quoteData = quote.data()
//                         quoteData.mediaid = mongoose.Types.ObjectId(updatedBook._id)
//                         quoteData.tags = Object.keys(quoteData.tags)
//                         quoteData.bibleRefs = quoteData.bibleRef
//                         delete quoteData.author
//                         delete quoteData.mediaTitle
//                         delete quoteData.mediaImageURL
//                         delete quoteData.bibleTags
//                         delete quoteData.bibleRef
//                         console.log(quoteData)
//                         var newQuote = new Quote(quoteData)
//                         newQuote.save(function (err, updatedQuote) {
//                             if (err) console.error(err)
//                             console.log(updatedQuote)
//                         })
//                     })
//                 })
//             })
//         })
//     })
//     .catch((err) => {
//         console.log('Error getting books...', err)
//     })
// store.collection('quotes').get()
//     .then((snapshot) => {
//         snapshot.forEach((doc) => {
//             var data = doc.data()
//             data.tags = Object.keys(data.tags)
//             data.bibleRefs = data.bibleRef
//             delete data.author
//             delete data.mediaTitle
//             delete data.mediaImageURL
//             delete data.bibleTags
//             delete data.bibleRef
//             console.log(data)
//             var newQuote = new Quote(data)
//             newQuote.set({ _id: doc.id })
//             newQuote.save(function (err, updatedBook) {
//                 if (err) console.error(err)
//                 console.log(updatedBook)
//             })
//         })
//     })
//     .catch((err) => {
//         console.log('Error getting documents...', err)
//     })
// store.collection('quotes').get()
//     .then((snapshot) => {
//         console.log(snapshot)
//     })
