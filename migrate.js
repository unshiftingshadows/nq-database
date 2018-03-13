const admin = require('firebase-admin')

const serviceAccount = require('./nq_credentials.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://notes-and-quotes-977a3.firebaseio.com'
})

var store = admin.firestore()

const mongoose = require('mongoose')

const dbOptions = require('./db_cred.js')

mongoose.connect('mongodb://localhost:27017/notesandquotes', dbOptions)
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log('we are connected!!!')
})

// Add media models
const Book = require('./models/Book.js')
const Quote = require('./models/Quote.js')
// const Author = require('./models/Author.js')

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
