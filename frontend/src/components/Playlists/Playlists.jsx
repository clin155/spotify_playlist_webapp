import axios from "axios";
import uuid from 'react-uuid';

import { PlaylistRow } from "./PlaylistRow"
import InfiniteScroll from 'react-infinite-scroller';
import { useState } from "react";
import { Button } from "react-bootstrap";

function gork() {
    const params = new URLSearchParams({
        limit: 15,
        offset: 0,
    }).toString();
    return "https://api.spotify.com/v1/me/playlists?" + params;

}

export function Playlists(props) {

    const [ playlists, setPlaylists ] = useState([])
    const [ hasMore, setHasMore ] = useState(true)
    const [ next, setNext ] = useState(() => gork())
    const [ next2, setNext2 ] = useState(`${process.env.REACT_APP_BACKEND_URL}/api/playlist/`)

    function fetchMore() {
        if (next2 !== "" ) {
            axios.get(next2, { withCredentials: true})
                .then(res => {
                    if (res.data === "") {
                        window.location.reload();
                        return
                    }
                    const { data } = res;
                    setNext2(data.next)
                    data.result.forEach((dat) => {
                        setPlaylists(
                            old => [...old, <PlaylistRow 
                                showPlaylist={props.showPlaylist} 
                                imgUrl={dat.imgUrl}
                                name={dat.name}
                                id={dat._id}
                                isSpotify={false}
                                key={uuid()}
                            />])
                    })

                })
        } 
        else {
            axios.get(next, {
                headers: {
                    "Authorization": `Bearer ${props.token}`
                }
            })
                .then(res => {
                    const items = res.data.items;
                    items.forEach((item, ind) => {
                        let imgUrl = null
                        if (item.images.length > 0) {
                            imgUrl = item.images[0]["url"]
                        }
                        setPlaylists(oldPlaylist => [...oldPlaylist, <PlaylistRow 
                            showPlaylist={props.showPlaylist} 
                            imgUrl={imgUrl}
                            name={item.name}
                            id={item.id}
                            isSpotify={true}
                            key={uuid()}
                        />])
                    })
                    if (!res.data.next) {
                        setHasMore(false)
                    }
                    else {
                        setNext(res.data.next)
                    }
                })
        }

    }

    async function newPlayList() {

        const instance = axios.create({
            withCredentials: true
        })
        const res = await instance.put(`${process.env.REACT_APP_BACKEND_URL}/api/playlist/`);
        if (res.status === 201) {
            const { data: { playlist } } = res;
            setPlaylists(oldPlaylist => [<PlaylistRow 
                showPlaylist={props.showPlaylist} 
                imgUrl={playlist.imgUrl}
                name={playlist.name}
                id={playlist._id}
                isSpotify={false}
                key={uuid()}/>, ...oldPlaylist]
            )

        }
        
    }

    return (
            <div className={props.className} style={{display:"flex", flexDirection:"column", gap: 10}}>
                <h2>Playlists</h2>
                    <div className="ye">
                        <Button onClick={newPlayList} className="btn btn-success btn-lg">
                            empty playlist
                        </Button>
                        <Button onClick={() => props.setIsGenerating(true)} className="btn btn-success btn-lg float-start"
                        >
                            generate playlist
                        </Button>
                    </div>
                <div className={`playlists`}>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={fetchMore}
                        hasMore={hasMore}
                        loader={<h4 key={uuid()}>Loading...</h4>}
                        useWindow={false}
                        >
                    {playlists}
                    </InfiniteScroll>
                </div>
            </div>
    )
}