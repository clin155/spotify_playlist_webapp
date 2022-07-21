import { Song } from './Song';
import axios from 'axios';

import InfiniteScroll from 'react-infinite-scroller';
import { useEffect, useState } from 'react';


function gork(id) {
    const params = new URLSearchParams({
        limit: 10,
        offset: 0
    }).toString();

    return `https://api.spotify.com/v1/playlists/${id}/tracks?` + params;
}

export function Playlist(props) {
    const [ tracks, setTracks ] = useState([]);
    const [ name, setName ] = useState();
    const [ owner, setOwner ] = useState();
    const [ next, setNext ] = useState(() => gork(props.id))
    const [ hasMore, setHasMore ] = useState(true)

    function addTracks() {
        axios.get(next, {
            headers: {
                "Authorization": `Bearer ${props.token}`
            } 
        })
            .then((data) => {
                const tracks = data.data.items;
                tracks.forEach((track) => {
                    setTracks((prevTracks) => [...prevTracks, <Song data={track}></Song>])
                })
                if (!data.data.next) {
                    setHasMore(false)
                }
                else {
                    setNext(data.data.next)
                }
            })
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