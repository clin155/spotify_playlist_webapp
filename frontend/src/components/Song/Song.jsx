import placeholder from "./../../static/images/placeholder.jpg";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import IconButton from '@mui/material/IconButton';

import axios from "axios";



export function Song(props) {
    const { albumUrl, artist, 
        title, playlistId, onPlaylist, 
        songInd,editing, uri, playSong, 
        setSearch, addToBank, id } = props;
    const [ coverImg, setCoverImg ] = useState(placeholder);
    useEffect(() => {
            setCoverImg(albumUrl)            
    }, [albumUrl])

    async function addToSongBank() {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/bank/`, {
            tracks: [
                {
                    albumUrl: albumUrl,
                    artist: artist,
                    title: title,
                    uri: uri,
                    id: id
                }
            ]
        }, {
            withCredentials: true
        })
        if (res.status === 201) {
            if (setSearch) {
                setSearch("")
            }
            addToBank()
        }

    }

    const addSongToPlaylist = async function () {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/playlist/${playlistId}`, {
                tracks: [
                    {
                        albumUrl: albumUrl,
                        artist: artist,
                        title: title,
                        uri: uri,
                        id: id
                    }
                ]
            }, {
                withCredentials: true
            })
            if (res.status === 201) {
                props.setTracksWrapper(title, artist,albumUrl, playlistId, uri, id, "adding")
                if (!onPlaylist) setSearch("")
            }

        }
        catch (err) {
            console.log(err);
        }
    }

    async function deleteSong() {
        try {
            const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/track/${songInd}/playlist/${playlistId}/`,
            {
                withCredentials: true
            })
            if (res.status === 204) {
                props.setTracksWrapper(title, artist,albumUrl, playlistId, uri, "deleteing", songInd)
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    
    return (
        <div className="playlistrow2">
            <div className="part1">
                <img className="cover" src={coverImg} alt={"placeholder"}></img>
                <div className="textHolder">
                    <p className="songText"style={{whiteSpace: "nowrap"}}>{artist}</p>
                    <p className="songText"> {title}</p>
                </div>

            </div>
            <div className="part2">
                {editing && onPlaylist ? 
                <IconButton onClick={deleteSong}>
                    <FontAwesomeIcon className="delete" icon={faTrashCan}  />
                </IconButton> :
                !onPlaylist && 
                <IconButton onClick={addSongToPlaylist}>
                    <FontAwesomeIcon className="songIcon2" icon={faPlus}  />
                </IconButton>}
                {!editing && 
                    <>                  
                        <IconButton onClick={addToSongBank}>
                            <FontAwesomeIcon className="songIcon" icon={faBookmark} />
                        </IconButton>

                        <IconButton onClick={() => {
                                playSong();
                                if (setSearch) {
                                    setSearch("")
                                }
                        }} >
                            <FontAwesomeIcon className="songIcon2" icon={faPlay} />
                        </IconButton>
                    </>}
            </div>
        </div>
    )
}   