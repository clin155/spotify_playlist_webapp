import placeholder from "./../../static/images/placeholder.jpg";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import IconButton from '@mui/material/IconButton';

import axios from "axios";

export function BankSong(props) {
    const { albumUrl, title, 
        uri, artist, editing, deleteSong, 
        playlistId, setTracksWrapper, playSong,
        onGenerate, addToGenerate, id
    } = props
    const [ coverImg, setCoverImg ] = useState(placeholder);

    useEffect(() => {
        setCoverImg(albumUrl)            
    }, [albumUrl])

    async function addSongToPlaylist() {
        console.log(id)
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
                setTracksWrapper(title, artist,albumUrl, playlistId, uri, "adding")
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
                {editing ? 
                <IconButton onClick={deleteSong}>
                    <FontAwesomeIcon className="delete" icon={faTrashCan} 
                     />
                </IconButton> :
                <IconButton onClick={() => {
                    if (onGenerate) addToGenerate()
                    else addSongToPlaylist()
                    }}>
                    <FontAwesomeIcon className="songIcon2" icon={faPlus} 
                    />
                </IconButton>
                }
                {!editing && <IconButton onClick={playSong}>
                    <FontAwesomeIcon className="songIcon2" icon={faPlay} />
                </IconButton>}
            </div>
        </div>
    )
}