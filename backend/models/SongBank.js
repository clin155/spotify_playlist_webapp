const mongoose = require('mongoose');


const songbankSchema = mongoose.Schema({
    owner: {
        type: String,
        required: true,
    },
    tracks: {
        type: [
            {
                artist: String,
                title: String,
                albumUrl: String,
                uri: String,
                id: String
            }
        ],
        default: []
    }
})

module.exports = mongoose.model('SongBank', songbankSchema);