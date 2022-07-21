import placeholder from "./../../static/images/placeholder.jpg";
import { useState, useEffect } from 'react';

export function Song(props) {
    const [ coverImg, setCoverImg ] = useState(placeholder);
    const { album } = props.data.track;
    useEffect(() => {
        if (album.images.length > 0) {
            setCoverImg(album.images[0]["url"])
            
        }
    }, [])

    return (
        <div className="playlistrow2">
            <img className="cover" src={coverImg} alt={"placeholder"}></img>
            <p>{album.artists[0].name}</p>
        </div>
    )
}   