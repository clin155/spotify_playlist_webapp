//api/playlist/
const express = require('express');
const router = express.Router();

const Playlist = require('../models/Playlists')
const Counter = require('../models/Counter');
const User = require('../models/Users');

//get paginate
router.get('/', async (req, res) => {

    // const user = req.session.userid; 
    const user = "clin7985@gmail.com"

    // if (!req.session.userid) {
    //     res.sendStatus(403);
    //     return;
    // }
    let offset = req.query.offset || 0;
    let limit = req.query.limit || 20;
    const docs = await Playlist.find({ owner: req.session.userid }).sort( 
        { sequenceValue : -1 }).skip(offset).limit(limit)
    const params = new URLSearchParams({
        offset: offset + limit,
        limit: limit
    }).toString()
    // result: docs,

    res.status(200).json({
        user: user,
        result: docs,
        next: docs.length >= limit ? process.env.HOST_URL + '/api/playlist/?' + params : ""
    })
})

//create a new playlist
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
        const playlist = await putHelper(0, user, tracks)
        res.status(201).json({
            playlist: playlist,
            "created": true
        })
        
        
    }
    else {
        await Counter.updateOne({ dbName: "Playlists" }, { $inc: { sequenceValue: 1}})
        const playlist = await putHelper(docs.sequenceValue+1, user, tracks)
        res.status(201).json({
            playlist: playlist,
            "created": false
        })
    }

})

//updateExistingPlaylist
router.post('/:id/', async (req, res) => {
    const id = req.params.id;
    const user = req.session.userid;
    const tracks = req.body.tracks;
    const name = req.body.name;
    if (!req.session.userid) {
        res.sendStatus(403);
        return;
    }
    try {
        const docs = await Playlist.findById(id)
        if (docs == null ) {
            res.status(404).json({
                error: "id does not exist"
            });
            return;
        }
        if ( docs.owner !== user ) {
            res.status(403).json({
                error: "wrong user"
            })
            return;
        }
        let newTracks = [];
        if (tracks) {
            newTracks = [...docs.tracks, ...tracks]
            await Playlist.updateOne({ _id: id }, { tracks: newTracks})
        }
        if (name) {
            await Playlist.updateOne({_id: id}, { name: name})
        }
        res.status(201).json({
            name: name,
            tracks: newTracks,
            created: true
        })

    } catch (err) {
        console.log(err, id)
        res.status(403).json({
            error: err.message,
            type: "probably bad id"
        })
    }
})

//get singular playlist
router.get('/:id/', async (req, res) =>{
    const id = req.params.id;
    const user = req.session.userid;
    if (!req.session.userid) {
        res.sendStatus(403);
        return;
    }
    const docs = await Playlist.findOne({ _id: id })
    if (docs == null ) {
        res.status(404).json({
            error: "id does not exist"
        });
        return;
    }
    if ( docs.owner !== user ) {
        res.status(403).json({
            error: "wrong user"
        })
        return;
    }
    res.json(docs)
})
//get tracks
router.get('/:id/tracks/', async (req, res) =>{
    const id = req.params.id;

    let offset = req.query.offset || 0;
    let limit = req.query.limit || 100;
    if (!req.session.userid) {
        res.sendStatus(403);
        return;
    }
    const docs = await Playlist.findOne({_id: id});
    if (docs == null) {
        res.status(404).json({
            error: "id does not exist"
        });
        return;
    }
    const { tracks } = docs;
    const newTracks = tracks.slice(offset, offset+limit)
    const params = new URLSearchParams({
        offset: offset + limit,
        limit: limit
    })
    const docs2 = await User.findOne( { email: docs.owner })

    res.json({
        next: offset+limit < tracks.length ? process.env.REACT_APP_BACKEND_URL + "/api/${id}/newTracks/?" + params : "",
        result: newTracks,
        owner: docs2.name,
        name: docs.name
    })

})

router.delete('/:id/', async (req, res) => {
    if (!req.session.userid) {
        res.sendStatus(403);
        return;
    }
    const id = req.params.id;
    try {
        const docs = await Playlist.findOneAndDelete({_id: id})
        if (docs == null) {
            res.sendStatus(404);
            return;
        }
    } catch (err) {
        res.sendStatus(403).json({ err : err.message})
        return
    }
    res.sendStatus(204);

}) 

putHelper = async (sequenceNum, user, tracks) => {
    const playlist = new Playlist({
        owner: user,
        name: "My Playlist " + sequenceNum.toString(),
        sequenceValue: sequenceNum,
        tracks: tracks
    })
    return playlist.save();
}




module.exports = router;