import { Playlists, Playlist } from "../Playlists"
import { useState,useEffect } from "react";

import { SearchBar } from "../SearchBar";
import { Song } from "../Song"
import uuid from 'react-uuid';



export function Home(props) {

    const [openedPlaylist, setopenedPlaylist] = useState(false);
    const [currPlaylistId, setCurrPlaylistId] = useState();
    const [ tracks, setTracks ] = useState([]);
    const [ isSpotify, setIsSpotify ] = useState();


    function showPlaylist(id, isSpotify) {
        setopenedPlaylist(true)
        setCurrPlaylistId(id)
        setIsSpotify(isSpotify)
    }

    function setTracksWrapper(title,artist,albumUrl,playlistId) {
        setTracks(prevTracks => [...prevTracks, <Song
            title={title}
            artist={artist}
            albumUrl={albumUrl}
            playlistId={playlistId}
            key={uuid()}
            ></Song>])
    }
    
    function resetTracks() {
        setTracks([])
    }

    return (
        <div className="home">
            <SearchBar token={props.accessToken} 
            spotifyApi={props.spotifyApi} playlistId={currPlaylistId} 
            setTracksWrapper={setTracksWrapper}
            tracks={tracks} />
            <div className="flexor-container">
                <Playlists className="box" token={props.accessToken} showPlaylist={showPlaylist}/>
                {openedPlaylist
                    ?  <Playlist className="box" token={props.accessToken} id={currPlaylistId}
                        setTracksWrapper={setTracksWrapper}
                        resetTracks={resetTracks}
                        tracks={tracks}
                        isSpotify={isSpotify}/> 
                    : <div className="box"></div>
                }
            </div>
        </div>

    )
}