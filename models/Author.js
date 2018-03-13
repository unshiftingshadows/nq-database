const mongoose = require('mongoose')
const Schema = mongoose.Schema

const config = require('../nq_config.js')

var authorSchema = new Schema({
    name: {
        first: {
            type: String,
            required: true
        },
        middle: {
            type: String,
            default: ''
        },
        last: {
            type: String,
            default: ''
        },
        suffix: {
            type: String,
            default: ''
        }
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
}, { toJSON: { virtuals: true } })

authorSchema.virtual('fullName').get(function () {
    var full = ''
    if (this.name.first != '') {
        full = full + ' ' + this.name.first
    }
    if (this.name.middle != '') {
        full = full + ' ' + this.name.middle
    }
    if (this.name.last != '') {
        full = full + ' ' + this.name.last
    }
    if (this.name.suffix != '') {
        full = full + ' ' + this.name.suffix
    }
    return full
})

module.exports = mongoose.model('Author', authorSchema)