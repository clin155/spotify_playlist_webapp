const express = require('express');
const mongoose = require('mongoose');
const SongBank = require('../models/SongBank');

const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.session.userid) {
        res.sendStatus(403);
        return;
    }
    const user = req.session.userid;
    const docs = await SongBank.findOne( {owner: user} )
    if (docs == null) {
        const bank = new SongBank({
            owner: user
        })
        await bank.save()
        res.status(201).json({
            "bank": [],
            "created": true
        })
        return;
    }
    res.json({
        "bank": docs.tracks,
        "created": false
    })
})

router.post('/', async (req, res) => {
    if (!req.session.userid) {
        res.sendStatus(403);
        return;
    }
    const newTracks = req.body.tracks
    const user = req.session.userid || 'GORK';

    const docs = await SongBank.findOne( {owner: user} )

    if (docs == null) {
        const bank = new SongBank({
            owner: user,
            tracks: newTracks
        })
        await bank.save()
        res.status(201).json({
            "bank": [],
            "created": true
        })
        return;
    }

    const newTrackArr = [...docs.tracks, ...newTracks];
    await SongBank.updateOne( {owner: user }, {tracks: newTrackArr})

    res.json({
        "bank": newTrackArr,
        "created": false
    })
})


module.exports = router;