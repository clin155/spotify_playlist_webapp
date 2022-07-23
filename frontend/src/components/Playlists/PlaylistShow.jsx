import axios from 'axios';
import uuid from 'react-uuid';

import InfiniteScroll from 'react-infinite-scroller';
import { useEffect, useState } from 'react';


function gork(id, isSpotify) {
    if (isSpotify) {
        const params = new URLSearchParams({
            limit: 10,
            offset: 0
        }).toString();

        return `https://api.spotify.com/v1/playlists/${id}/tracks?` + params;
    }
    return `http://localhost:8000/api/playlist/${id}/tracks/`
}

export function Playlist(props) {
    const { id, isSpotify, token, tracks, setTracksWrapper, resetTracks } = props;
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

                    setTracksWrapper(trac.name, artist, trac.album.images[0]["url"], id)
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
                        setTracksWrapper(track.title, track.artist, track.albumUrl, id)
                    }
                })

            } catch(err) {
                console.log(err);
            }
        }
    }

    // useEffect(() => {
    //     console.log("e");
    //     setName((prevName) => prevName)
    // }, [JSON.stringify(tracks)])

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

    }, [id, isSpotify, token])
    return (
        <div className={props.className}>
            <p>{name}</p>
            <p>{owner}</p>
            <div className="playlists">
                <InfiniteScroll 
                    pageStart={0}
                    loadMore={addTracks}
                    hasMore={hasMore}
                    loader={<h4 key={uuid()}>Loading...</h4>}
                    useWindow={false}
                    >
                {tracks}
                </InfiniteScroll>
            </div>
        </div>
    )
}