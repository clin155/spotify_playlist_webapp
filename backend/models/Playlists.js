const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true,
    },
    name: {
       type: String,
       required: true,
    }

})

module.exports = mongoose.model('Playlist', playlistSchema);