import axios from "axios";
import Stack from '@mui/material/Stack';

import { Button } from "react-bootstrap";


import { useState, useEffect } from "react";
import { SearchBarSongs, SearchBarArtist, SearchBarGenre } from "../SearchBars";
import { Param } from "./"
import TextField from "@mui/material/TextField";


function helper(seeds, typee, type2,newParams) {
    let retString = ""
    seeds.forEach((seed) => {
        if (seed[typee]) {
            if (typee === "genre") {
                retString += seed.genre + ","
            } else {
                retString += seed.id + ","

            }
        }
    })
    const strr = retString.slice(0, -1)
    if (strr !== "") newParams[type2] = strr
}

function helper2(params, newParams, neww, round=false) {
    if (params[neww]) { 
        newParams["target_"+neww] = params[neww];
        if (round) newParams["target_"+neww] = Math.round(newParams["target_"+neww])
        newParams["min_"+neww] = 0;
        if (neww === "popularity") {
            newParams["max_"+neww] = 100;
        } else {
            newParams["max_"+neww] = 1;
        }
    }
}

function createQueryStr(params, seeds, num) {
    const newParams = {}
    helper2(params, newParams,"acousticness")
    helper2(params, newParams,"danceability")
    helper2(params, newParams,"energy")
    helper2(params, newParams,"instrumentalness")
    helper2(params, newParams,"popularity", true)
    helper2(params, newParams,"loudness")

    helper(seeds, "song", "seed_tracks", newParams)
    helper(seeds, "artist", "seed_artists", newParams)
    helper(seeds, "genre", "seed_genres", newParams)

    newParams.limit = num;
    const param = new URLSearchParams(newParams).toString();
    return param
}


export function Generating(props) {
    const { seeds, setSeeds } = props;
    const [ params, setParams ] = useState({});
    const [ error, setError ] = useState("");
    const [ output, setOutput ] = useState("");
    const [ numSongs, setNumSongs ] = useState(20);

    useEffect(() => {
        if (seeds.length > 5) {
            setError("Error: Cannot have more than 5 artists genres songs at once")
            setSeeds(prev => {
                const newSeeds = [...prev]
                while (newSeeds.length > 5) {
                    newSeeds.splice(-1, 1);
                }
                return newSeeds
            })
        }
    }, [seeds, setSeeds])
    function addSong(id, title) {
        setSeeds(old => [...old, {"id": id, "song": title}])
    }
    function addArtist(id, title) {
        if (seeds.length < 5) {
            setSeeds(old => [...old, {"id": id, "artist": title}])
        }
        else {
            setError("Error: Cannot have more than 5 artists genres songs at once")
        }
    }
    function addGenre(id, title) {
        if (seeds.length < 5) {
            setSeeds(old => [...old, {"id": id, "genre": title}])
        }
        else {
            setError("Error: Cannot have more than 5 artists genres songs at once")
        }
    }

    async function runQuery() {
        setError("")
        if (seeds.length === 0) {
            setError("Error: need at lest one album, artist, or song")
            return 
        }
        const num = parseInt(numSongs);
        if (num <= 0 || num >= 100) {
            setError("Error: invalid numSongs range:(0,100)")
            return
        }
        const param = createQueryStr(params, seeds, num)
        const res = await axios.get("https://api.spotify.com/v1/recommendations?" + param, {
            headers: { 'Authorization': `Bearer ${props.token}` }
        })
        if (res.statusCode !== 200) {
            setOutput("Error getting recommendations: try again")
        }
        const tracks = res.data.tracks;
        if (tracks.length === 0) {
            setOutput("No recommendations: try loosening paramters")
        }
        else {
            const newTracks = tracks.map(track => {
                const newTrack = {}
                try {
                    newTrack.artist = track.artists[0].name;
                    newTrack.title = track.name;
                    newTrack.albumUrl = track.album.images[0].url;
                    newTrack.uri = track.uri;
                } catch (e) {
                    ;
                }
                return newTrack;
            })
            const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/playlist/`, {
                    tracks: newTracks
                },
                { withCredentials: true})
            if (res.status !== 201) {
                setOutput("Interal Error, try again")
                console.log(res, res.status)
                return;
            }
            props.setIsGenerating(false)
        }

    }
    
    function playSong(uri, id) {
        props.setPlayingSongs([
            {
                uri: uri, 
                id: id
            }
            ])
        props.setPlayingOffset(0);
    }

    return (
        <div className="generator">
            <div className="before">
                <Button className="goBack" onClick={() => props.setIsGenerating(false)}>Go Back</Button>
                <TextField className="fieldd" id="outlined-basic" label="# of Songs" variant="outlined"
                value={numSongs} onChange={(e) => {
                    setNumSongs(e.target.value)
                }}/>
            </div>
            <Param label="acousticness" setParams={setParams}/>
            <Param label="danceability" setParams={setParams}/>
            <Param label="energy" setParams={setParams}/>
            <Param label="instrumentalness" setParams={setParams}/>
            <Param label="popularity" setParams={setParams} min={0} max={100} />
            <Param label="loudness" setParams={setParams}/>


            <Stack spacing={3} direction="row" sx={{ mb: 1 }} alignItems="start">                
                <SearchBarSongs token={props.token} spotifyApi={props.spotifyApi}
                addToQuery={addSong}
                playSong={playSong}
                setBankSongs={props.setBankSongs}
                setOpen={props.setOpen}
                ></SearchBarSongs>
                <SearchBarArtist token={props.token} spotifyApi={props.spotifyApi}
                addToQuery={addArtist}></SearchBarArtist>
                <SearchBarGenre token={props.token} spotifyApi={props.spotifyApi}
                addToQuery={addGenre}></SearchBarGenre>
            </Stack>
            <Button onClick={() => {
                setError("")
                setSeeds([])
            }}>Clear</Button>
            <p style={{overflowWrap: "break-word"}}>{JSON.stringify(params)}</p>
            <p>{seeds.map((val) => JSON.stringify(val))}</p>
            <p>{numSongs}</p>
            <p style={{color:"red"}}>{error}</p>
            
            <Button onClick={runQuery}>Generate</Button>
            <p>{output}</p>
        </div>
    )
}