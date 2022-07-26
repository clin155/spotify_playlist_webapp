const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true,
    },
    name: {
       type: String,
       required: true,
    },
    created: {
        type: Date,
        default: Date.now()
    },
    sequenceValue: {
        type: Number,
        required: true
    },
    tracks: {
        type: [
            {
                artist: String,
                title: String,
                albumUrl: String,
                uri: String,
                id: String,
            }
        ],
        default: []
    },
    imgUrl: {
        type: String,
        default: null
    }

})

module.exports = mongoose.model('Playlist', playlistSchema);