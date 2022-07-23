import { Playlists, Playlist } from "../Playlists"
import { useState,useEffect } from "react";

import { SearchBar } from "../SearchBar";



export function Home(props) {

    const [openedPlaylist, setopenedPlaylist] = useState(false);
    const [currPlaylistId, setCurrPlaylistId] = useState();



    function showPlaylist(id) {
        setopenedPlaylist(true)
        setCurrPlaylistId(id)
    }

    return (
        <div className="home">
            <SearchBar token={props.accessToken} spotifyApi={props.spotifyApi}/>
            <div className="flexor-container">
                <Playlists className="box" token={props.accessToken} showPlaylist={showPlaylist}/>
                {openedPlaylist
                    ? <Playlist className="box" token={props.accessToken} id={currPlaylistId}></Playlist>
                    : <div className="box"></div>
                }
            </div>
        </div>

    )
}