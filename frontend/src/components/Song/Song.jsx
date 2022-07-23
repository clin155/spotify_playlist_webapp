import placeholder from "./../../static/images/placeholder.jpg";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark } from '@fortawesome/free-solid-svg-icons';

import axios from "axios";



export function Song(props) {
    const [ coverImg, setCoverImg ] = useState(placeholder);
    useEffect(() => {
            setCoverImg(props.albumUrl)            
    }, [props.albumUrl])

    function addToSongBank() {
        axios.post('http://localhost:8000/api/bank/', {
            tracks: [
                {
                    albumUrl: props.albumUrl,
                    artist: props.artist,
                    title: props.title
                }
            ]
        }, {
            withCredentials: true
        })
    }

    return (
        <div className="playlistrow2">
            <img className="cover" src={coverImg} alt={"placeholder"}></img>
            <p>{props.artist}</p>
            <p>{props.title}</p>
            <FontAwesomeIcon icon={faBookmark} onClick={addToSongBank}/>
        </div>
    )
}   