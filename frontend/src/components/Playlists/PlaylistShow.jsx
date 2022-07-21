import { Song } from './Song';
import axios from 'axios';

import { useEffect, useState } from 'react';

export function Playlist(props) {
    const [ tracks, setTracks ] = useState([]);


    useEffect(() => {
        const { data } = props;
        if (data.tracks.total > 0) {
            axios.get(data.tracks.href, {
                headers: {
                    "Authorization": `Bearer ${props.token}`
                }
            })
                .then((data) => {
                    console.log(data)
                })
        }
    })
    return <div></div>
}