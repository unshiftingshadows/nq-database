const mongoose = require('mongoose')

const dbOptions = require('../db_cred.js').builder

module.exports = exports = mongoose.createConnection('mongodb://localhost:27017/otherCurriculum', dbOptions)
