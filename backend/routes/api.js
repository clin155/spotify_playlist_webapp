const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        '/api/': 'show routes and help',
        '/api/playlist': 'get and post playlists',
        '/api/songbank': 'get and post songbank',
        '/api/user': 'get current user'
    })
})

module.exports = router;