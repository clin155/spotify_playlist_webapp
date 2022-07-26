import { useState, useEffect } from 'react';
// import axios from 'axios';

import placeholder from "./../../static/images/placeholder.jpg";
import { ReactComponent as SpotifySvg } from '../../static/spotify.svg';

export function PlaylistRow(props) {
    const [ coverImg, setCoverImg ] = useState(placeholder);
    const { id, name, imgUrl, isSpotify } = props;

    useEffect(() => {
        if (imgUrl != null) {
            setCoverImg(imgUrl)
        }
    }, [imgUrl])

    return (
        <div className="playlistrow" onClick={() => props.showPlaylist(id, isSpotify)}>
            <img className="cover" src={coverImg} alt={"placeholder"}></img>
            <p className="rowName">{name}</p>
            {isSpotify ? <SpotifySvg className="spotifySvg"/> : <div></div>}
            
        </div>
    )
}   