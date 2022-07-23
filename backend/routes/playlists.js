const express = require('express');
const router = express.Router();

const Playlist = require('../models/Playlists')
const Counter = require('../models/Counter')

router.get('/', async (req, res) => {
    const user = req.session.userid;

    if (!req.session.userid) {
        res.sendStatus(403);
        return;
    }
    let offset = req.query.offset || 0;
    let limit = req.query.limit || 20;
    const docs = await Playlist.find({ owner: req.session.userid }).sort( 
        { sequenceValue : 1 }).skip(offset).limit(limit)
    const params = new URLSearchParams({
        offset: offset + limit,
        limit: limit
    }).toString()
    res.json({
        result: docs,
        next: docs.length >= limit ? process.env.HOST_URL + '/api/playlist/?' + params : ""
    }).status(200)
})

router.put('/', async (req, res) => {
    const user = req.session.userid;
    const tracks = req.body.tracks
    if (!req.session.userid) {
        res.sendStatus(403);
        return;
    }
    const docs = await Counter.findOne({dbName: { $eq: "Playlists" } })

    if (docs == null) {
        const counter = new Counter({
            dbName: "Playlists"
        })
        await counter.save();
        const playlist = await postHelper(0, user, tracks)
        res.status(201).json({
            id: playlist._id,
            "created": true
        })
        
        
    }
    else {
        await Counter.updateOne({ dbName: "Playlists" }, { $inc: { sequenceValue: 1}})
        const playlist = await postHelper(docs.sequenceValue+1, user, tracks)
        res.status(201).json({
            id: playlist._id,
            "created": true
        })
    }

})

postHelper = async (sequenceNum, user, tracks) => {
    const playlist = new Playlist({
        owner: user,
        name: "My Playlist " + sequenceNum.toString(),
        sequenceValue: sequenceNum,
        tracks: tracks
    })
    return playlist.save();
}



module.exports = router;