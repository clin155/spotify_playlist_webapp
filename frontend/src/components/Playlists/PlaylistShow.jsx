import { Song } from '../Song';
import axios from 'axios';

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
    return "http://localhost:8080/api/playlists/"
}

export function Playlist(props) {
    const { id, isSpotify } = props;
    const [ tracks, setTracks ] = useState([]);
    const [ name, setName ] = useState();
    const [ owner, setOwner ] = useState();
    const [ next, setNext ] = useState(() => gork(id, isSpotify))
    const [ hasMore, setHasMore ] = useState(true)

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

                    setTracks((prevTracks) => [...prevTracks, <Song
                        artist={artist} 
                        albumUrl={trac.album.images[0]["url"]}
                        title={trac.name}
                        />]
                    )
                }
                catch(err) {
                    console.log(track, err)
                }

            })
            if (!res.data.next) {
                setHasMore(false)
            }
            else {
                setNext(res.data.next)
            }
        }
        else {
            try {
                const res = await axios.get(next, { withCredentials: true});


            } catch(err) {
                console.log(err);
            }
        }
    }

    useEffect(() => {
        axios.get(`https://api.spotify.com/v1/playlists/${props.id}`, {
            headers: {
                "Authorization": `Bearer ${props.token}`
            }
        })
            .then((data) => {
                setName(data.data.name)
                setOwner(data.data.owner.display_name)
                setHasMore(true)
                setNext(() => gork(props.id))
                setTracks([])
            })

    }, [props.id])
    return (
        <div className={props.className}>
            <p>{name}</p>
            <p>{owner}</p>
            <div className="playlists">
                <InfiniteScroll 
                    pageStart={0}
                    loadMore={addTracks}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    useWindow={false}
                    >
                {tracks}
                </InfiniteScroll>
            </div>
        </div>
    )
}