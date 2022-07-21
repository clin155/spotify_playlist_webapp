import { useState, useEffect } from 'react';
// import axios from 'axios';

import placeholder from "./../../static/images/placeholder.jpg";

export function PlaylistRow(props) {
    const [ coverImg, setCoverImg ] = useState(placeholder);

    useEffect(() => {
        const { data } = props;
        if (data.images.length > 0) {
            setCoverImg(data.images[0]["url"])

        }
    }, [props])
    return (
        <div className="playlistrow">
            <img className="cover" src={coverImg} alt={"placeholder"}></img>
            <p>{props.data.name}</p>
        </div>
    )
}   