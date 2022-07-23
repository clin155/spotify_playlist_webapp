import placeholder from "./../../static/images/placeholder.jpg";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";



export function Song(props) {
    const { albumUrl, artist, title, playlistId } = props;
    const [ coverImg, setCoverImg ] = useState(placeholder);
    useEffect(() => {
            setCoverImg(albumUrl)            
    }, [albumUrl])

    function addToSongBank() {
        axios.post('http://localhost:8000/api/bank/', {
            tracks: [
                {
                    albumUrl: albumUrl,
                    artist: artist,
                    title: title
                }
            ]
        }, {
            withCredentials: true
        })
    }

    async function addSongToPlaylist() {
        try {
            props.setTracksWrapper(title, artist,albumUrl, playlistId)
            const res = await axios.post(`http://localhost:8000/api/playlist/${playlistId}`, {
                tracks: [
                    {
                        albumUrl: albumUrl,
                        artist: artist,
                        title: title
                    }
                ]
            }, {
                withCredentials: true
            })

        }
        catch (err) {
            console.log(err);
        }
    }


    return (
        <div className="playlistrow2">
            <img className="cover" src={coverImg} alt={"placeholder"}></img>
            <p>{artist}</p>
            <p>{title}</p>
            <FontAwesomeIcon icon={faBookmark} onClick={addToSongBank}/>
            <FontAwesomeIcon icon={faPlus} onClick={addSongToPlaylist}/>
        </div>
    )
}   