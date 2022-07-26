const express = require('express');

const router = express.Router();
const Playlist = require('../models/Playlists');

router.delete('/:index/playlist/:playlistId/', async (req, res) => {
    const user = req.session.userid;
    if (!user) {
        res.sendStatus(403);
        return;
    }
    const playlistId = req.params.playlistId;
    const index = req.params.index;

    const docs = await Playlist.findById(playlistId);
    if (docs == null) {
        res.sendStatus(404);
        return;
    }
    if ( docs.owner !== user ) {
        res.status(403).json({
            error: "wrong user"
        })
        return;
    }
    const { tracks } = docs;
    if (tracks.length <= index) {
        res.sendStatus(404);
        return;
    }
    tracks.splice(index, 1)
    await Playlist.updateOne({ _id: playlistId}, { tracks: tracks})
    res.sendStatus(204);
})


module.exports = router;