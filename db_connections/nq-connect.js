const mongoose = require('mongoose')

const dbOptions = require('../db_cred.js').nq

module.exports = exports = mongoose.createConnection('mongodb://localhost:27017/notesandquotes', dbOptions)
