const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        '/api/': 'show routes and help',
        '/api/playlist/': 'get and post playlists, put for new playlists',
        '/api/songbank/': 'get and post songbank',
        '/api/user/': 'get current user',
        '/api/bank/': "get and post users songbanks",
        '/api/login': "login",
        '/api/login/logout': "logout",
        '/api/tracks/id/playlist/playId': "delete tracks"
    })
})

module.exports = router;