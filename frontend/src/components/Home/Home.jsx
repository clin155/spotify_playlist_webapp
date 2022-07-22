import { Playlists, Playlist } from "../Playlists"
import { useState,useEffect } from "react";
import axios from 'axios';

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
                ? <Playlist className="box" token={props.accessToken} id={currPlaylistId}></Playlist>
                : <div className="box"></div>
            }
        </div>

    )
}