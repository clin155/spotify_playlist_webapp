import { Playlists, Playlist } from "../Playlists"
import { useState } from "react";

import { SearchBar } from "../SearchBar";
import { Generating } from "../Generating";
import { Player } from "./Player.jsx";
import { SongBank } from "../Bank";
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from "axios";

export function Home(props) {

    const [openedPlaylist, setopenedPlaylist] = useState(false);
    const [currPlaylistId, setCurrPlaylistId] = useState();
    const [ tracks, setTracks ] = useState([]);
    const [ isSpotify, setIsSpotify ] = useState();
    const [ editing, setEditing ] = useState(false);
    const [ isGenerating, setIsGenerating ] = useState(false);
    const [ seeds, setSeeds ] = useState([]);

    const [ playingSongs, setPlayingSongs ] = useState([]);
    const [ playingOffset, setPlayingOffset ] = useState(0);


    const [ openBank, setOpenBank ] = useState(false);
    const [ banksongs, setBankSongs ] = useState([]);
    const [ editingBank, setEditingBank ] = useState(false);

    function showPlaylist(id, isSpotify) {
        setEditing(false);
        setopenedPlaylist(true)
        setCurrPlaylistId(id)
        setIsSpotify(isSpotify)
    }
    function setTracksWrapper(title,artist,albumUrl,playlistId, uri, id, typee="adding", index=null) {
        if (typee === "adding") {
            setTracks(prevTracks => [...prevTracks, {
                    title: title,
                    artist: artist,
                    albumUrl: albumUrl,
                    playlistId: playlistId,
                    editing: editing,
                    "setTracksWrapper": setTracksWrapper,
                    songInd: prevTracks.length,
                    uri: uri,
                    id: id
                }])
        }
        else {
            setTracks(prevTracks => {
                const prevArr = [...prevTracks];
                prevArr.splice(index, 1);
                prevArr.forEach((track, ind) => {
                    track.songInd = ind
                })
                return prevArr;
            })
        }

    }
    function edit() {
        setEditing(prev => !prev)
    }
    function resetTracks() {
        setTracks([])
    }

    async function logout() {
        let isLogout = window.confirm("Confirm Logout?");
        if (isLogout) {
            const instance = axios.create({
                withCredentials: true,
            })
            const res = await instance.post(`${process.env.REACT_APP_BACKEND_URL}/api/login/logout/`,{
                withCredentials: true
            })
            if (res.status === 200) {
                window.location.reload()
            }
        }

    }

    return (
        <div className="home">
            <div className="header">
                <div className="editBank">
                    <IconButton onClick={() => setEditingBank(prev => !prev)}>
                        <EditIcon className="songIcon2" />
                    </IconButton>
                </div>
                <h1 className="title">Spotify Playlist Manager</h1>
                <div className="bank">
                    <IconButton onClick={logout}>
                        <LogoutIcon className="songIcon2" />
                    </IconButton>
                    <IconButton onClick={() => {setOpenBank(prev => !prev)}}>
                        <FontAwesomeIcon className="songIcon2" icon={faBookmark} />
                    </IconButton>
                </div>
            </div>
            {openBank && <SongBank 
                token={props.accessToken}
                banksongs={banksongs}
                setBanksongs={setBankSongs}
                editing={editingBank}
                playlistId={currPlaylistId}
                setTracksWrapper={setTracksWrapper}
                setPlayingSongs={setPlayingSongs}
                setPlayingOffset={setPlayingOffset}
                isGenerating={isGenerating}
                setSeeds={setSeeds}
            />}
            {isGenerating 
            ? <Generating setIsGenerating={setIsGenerating}
                spotifyApi={props.spotifyApi}
                token={props.accessToken}
                setPlayingSongs={setPlayingSongs}
                setPlayingOffset={setPlayingOffset}
                seeds={seeds}
                setSeeds={setSeeds}
                setOpen={setOpenBank}
                setBankSongs={setBankSongs}
                
            ></Generating>
            : 
            <>
            <SearchBar token={props.accessToken} 
                spotifyApi={props.spotifyApi} playlistId={currPlaylistId} 
                setTracksWrapper={setTracksWrapper}
                tracks={tracks}
                setPlayingSongs={setPlayingSongs}
                setBankSongs={setBankSongs}
                setOpen={setOpenBank}
                setPlayingOffset={setPlayingOffset}
                 />
            <div className="flexor-container">
                <Playlists className="box" token={props.accessToken}
                showPlaylist={showPlaylist}
                setIsGenerating={setIsGenerating}/>
                {openedPlaylist
                    ? 
                        <Playlist className="box" token={props.accessToken} id={currPlaylistId}
                        setTracksWrapper={setTracksWrapper}
                        resetTracks={resetTracks}
                        tracks={tracks}
                        isSpotify={isSpotify}
                        editing={editing}
                        setPlayingSongs={setPlayingSongs}
                        edit={edit}
                        setBankSongs={setBankSongs}
                        setOpen={setOpenBank}
                        setPlayingOffset={setPlayingOffset}
                        />
                    : <div className="box"></div>
                }
            </div>
            </>
            }
            <Player 
                token={props.accessToken}
                playingSongs={playingSongs}
                setPlayingSongs={setPlayingSongs}
                offset={playingOffset}
            />
        </div>

    )
}