import axios from "axios";

import { Playlist } from "./Playlist"
import InfiniteScroll from 'react-infinite-scroller';
import { useState } from "react";


function gork() {
    const params = new URLSearchParams({
        limit: 5,
        offset: 0,
    }).toString();
    return "https://api.spotify.com/v1/me/playlists?" + params;

}

export function Playlists(props) {

    const [ playlists, setPlaylists ] = useState([])
    const [ hasMore, setHasMore ] = useState(true)
    const [ next, setNext ] = useState(() => gork())

    function fetchMore() {
        axios.get(next, {
            headers: {
                "Authorization": `Bearer ${props.token}`
            }
        })
            .then(data => {
                const items = data.data.items;
                items.forEach(item => {
                    setPlaylists(oldPlaylist => [...oldPlaylist, <Playlist data={item} />])
                })
                if (!data.data.next) {
                    setHasMore(false)
                }
                else {
                    setNext(data.data.next)
                }
            })
    }

    return (
            <div className={`playlists ${props.className}`}>
                <InfiniteScroll 
                    pageStart={0}
                    loadMore={fetchMore}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    useWindow={false}
                    >
                {playlists}
                </InfiniteScroll>
            </div>
    )
}