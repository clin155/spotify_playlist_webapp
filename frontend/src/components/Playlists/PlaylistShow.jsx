import axios from 'axios';
import uuid from 'react-uuid';

import InfiniteScroll from 'react-infinite-scroller';
import { useEffect, useState } from 'react';
import { Song } from "../Song"
import Button from 'react-bootstrap/Button';
import { Input } from '@mui/material';

function gork(id, isSpotify) {
    if (isSpotify) {
        const params = new URLSearchParams({
            limit: 10,
            offset: 0
        }).toString();

        return `https://api.spotify.com/v1/playlists/${id}/tracks?` + params;
    }
    return `${process.env.REACT_APP_BACKEND_URL}/api/playlist/${id}/tracks/`
}

export function Playlist(props) {
    const { id, isSpotify, token, tracks, setTracksWrapper, resetTracks, 
        editing, setPlayingSongs, setBankSongs,
        setPlayingOffset } = props;
    const [ name, setName ] = useState();
    const [ owner, setOwner ] = useState();
    const [ next, setNext ] = useState(() => gork(id, isSpotify))
    const [ hasMore, setHasMore ] = useState(false)
    
    async function addTracks() {
        if (isSpotify) { 
     
            let res = null
            try {
                res = await axios.get(next, {
                    headers: {
                        "Authorization": `Bearer ${props.token}`
                    } 
                })
            }
            catch (err) {
                console.log(err);
                return;
            }
            const tracks = res.data.items;
            tracks.forEach((track) => {
                try {
                    const { track: trac } = track;
                    const artist = trac.album.artists[0].name;

                    setTracksWrapper(trac.name, artist, trac.album.images[0]["url"], id, trac.uri, trac.id)
                }
                catch(err) {
                    console.log(track, err)
                }

            })
            setNext(res.data.next)
            if (!res.data.next) {
                setHasMore(false)
            }
        }
        else {
            try {             
                const res = await axios.get(next, { withCredentials: true});
                const { next:nextRes, result, owner, name } = res.data;
                setNext(nextRes)
                setOwner(owner)
                setName(name)
                if (nextRes === "") {
                    setHasMore(false)
                }
                result.forEach(track => {
                    if (track.artist != null) {
                        setTracksWrapper(track.title, track.artist, track.albumUrl, id, track.uri, track.id)
                    }
                })

            } catch(err) {
                console.log(err);
            }
        }
    }
    useEffect(() => {
        if (isSpotify) {
            axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
                .then((data) => {
                    setName(data.data.name)
                    setOwner(data.data.owner.display_name)
                    setHasMore(true)
                    setNext(() => gork(id, isSpotify))
                    resetTracks()
                })
        }
        else {
            setHasMore(true);
            setNext(() => gork(id, isSpotify));
            resetTracks()
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isSpotify, token, editing])

    function playPlaylist(ind) {
        
        const newArr = tracks.map((track) => {
            return {
                uri: track.uri,
                id: track.id
            }
        })
        setPlayingSongs(newArr)
        setPlayingOffset(ind)
    }
    async function deletePlaylist(id) {
        const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/playlist/${id}`, {
            withCredentials: true
        })
        if (res.status === 204) {
            window.location.reload();
        }
    }
    async function eexport() {
        try {
            const res = await axios.get("https://api.spotify.com/v1/me", {
                headers: { 'Authorization': `Bearer ${props.token}` }
            })
            console.log(props.token)
            const userId = res.data.id;
            const res2 = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`,
            {
                "name": name,
                "description": "New playlist description",
                "public": false
            },
            {
                headers: { 'Authorization': `Bearer ${props.token}` }

            })
            if (res2.status === 201) {
                const playId = res2.data.id;
                const res3 = await axios.post(`https://api.spotify.com/v1/playlists/${playId}/tracks`, {
                    uris: tracks.map(track => track.uri)
                }, {
                    headers: { 'Authorization': `Bearer ${props.token}` }
                })
                if (res3.status === 201) window.location.reload()
            }
        } catch (e) {
            console.log(e)
        }

    }
    async function sendName() {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/playlist/${id}`, {
            name: name
        }, {
            withCredentials: true
        })
        if (res.status === 201) {
            props.edit()
        }
    }
    function addToBank(ind) {
        setBankSongs(prev => {
            const newSong = {
                uri: tracks[ind].uri,
                albumUrl: tracks[ind].albumUrl,
                title: tracks[ind].title,
                artist: tracks[ind].artist,
                id: tracks[ind].id

            }
            return [...prev, newSong]
        })
        props.setOpen(true)
    }
    return (
        <div className={props.className}>
            {!editing ? <p>{name}</p>
            : [<Input placeholder={name} value={name}
                onChange={e => setName(e.target.value)}
                />,
                <Button onClick={sendName}>Save</Button>]
            }
            <p>{owner}</p>
            <div className="buttons">
                <Button onClick={props.edit} style={{ backgroundColor: "green"}}>edit</Button>
                {editing && <Button onClick={() => deletePlaylist(id)}>delete</Button>}
                <Button onClick={eexport} style={{ backgroundColor: "green"}}>export</Button>
            </div>
            <div className="playlists">
                <InfiniteScroll 
                    pageStart={0}
                    loadMore={addTracks}
                    hasMore={hasMore}
                    loader={<h4 key={uuid()}>Loading...</h4>}
                    useWindow={false}
                    >
                {tracks.map((track,ind) => <Song
                    title={track.title}
                    artist={track.artist}
                    albumUrl={track.albumUrl}
                    playlistId={track.playlistId}
                    setTracksWrapper={track.setTracksWrapper}
                    songInd={track.songInd}
                    editing={track.editing}
                    uri={track.uri}
                    id={track.id}
                    playSong={() => playPlaylist(track.songInd)}
                    key={uuid()}
                    onPlaylist={true}
                    addToBank={() => addToBank(ind)}
                ></Song>
                )}
                </InfiniteScroll>
            </div>
        </div>
    )
}