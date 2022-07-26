const mongoose = require('mongoose');

const counterSchema = mongoose.Schema({
    dbName: {
        type: String,
        required: true
    },
    sequenceValue: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Counter', counterSchema)