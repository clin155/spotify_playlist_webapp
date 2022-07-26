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
    const user = req.session.userid;

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

    res.status(201).json({
        "bank": newTrackArr,
        "created": false
    })
})

router.delete('/:ind/', async (req, res) => {
    const user = req.session.userid;
    const ind = parseInt(req.params.ind);
    console.log(ind);
    if (!user) {
        res.sendStatus(403);
        return;
    }
    try {
        const docs = await SongBank.findOne( { owner: user})
        if (docs == null) {
            res.sendStatus(404);
            return
        }
        if (ind >= docs.tracks.length || ind < 0) {
            res.sendStatus(404);
            return;
        }
        const newTracks = [...docs.tracks]
        newTracks.splice(ind, 1)
        await SongBank.updateOne( { owner: user }, { tracks: newTracks })
    } catch (err) {
        res.status(403).json({
            error: err.message
        })
    }
    res.sendStatus(204);

})

module.exports = router;