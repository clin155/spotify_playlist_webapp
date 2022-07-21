import { Playlists, Playlist } from "../Playlists"
import { useState } from "react";

export function Home(props) {

    const [openedPlaylist, setopenedPlaylist] = useState(false);
    const [currPlaylistId, setCurrPlaylistId] = useState();


    function showPlaylist(id) {
        setopenedPlaylist(true)
        setCurrPlaylistId(id)
    }


    return (
        <div className="flexor-container">
            <Playlists className="box" token={props.accessToken} showPlaylist={showPlaylist}/>
            {openedPlaylist
                ? <Playlist id={currPlaylistId}></Playlist>
                : <div className="box"></div>
            }
        </div>

    )
}