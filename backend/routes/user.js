const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    let session = req.session;
    
    res.json({
        'email': session.userid
    })
})

module.exports = router;