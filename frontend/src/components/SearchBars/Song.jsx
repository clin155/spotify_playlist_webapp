import { useEffect, useState } from "react"
import placeholder from "./../../static/images/placeholder.jpg";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import IconButton from '@mui/material/IconButton';

import axios from "axios";



export function Song(props) {
    const { albumUrl, artist, 
        title, id, 
        uri, playSong, 
        addToBank } = props;
    const [ coverImg, setCoverImg ] = useState(placeholder);

    useEffect(() => {
            setCoverImg(albumUrl)            
    }, [albumUrl])

    async function addToSongBank() {
        console.log(id)
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
            addToBank()
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
                <IconButton>
                    <FontAwesomeIcon className="songIcon2" icon={faPlus} onClick={() => props.addToQuery(id, title)} />
                </IconButton>
                <IconButton>
                        <FontAwesomeIcon className="songIcon" icon={faBookmark} onClick={addToSongBank}/>
                </IconButton>
                <IconButton>
                    <FontAwesomeIcon className="songIcon2" icon={faPlay} onClick={
                        () => playSong(uri, id)
                        } />
                </IconButton>
            </div>
        </div>
    )
}   
// export function Song(props) {
//     const [coverImg, setcoverImg] = useState(placeholder); 
//     const { albumUrl, artist, uri, title,id } = props;
    
    
//     useEffect(() => {
//         if (!albumUrl) return;
//         setcoverImg(albumUrl);
//     },[albumUrl])



//     return (
//         <div className="playlistrow2">
//             <div className="part1">
//                 <a href={uri}><img className="cover" src={coverImg} alt={"placeholder"}></img></a>
//                 <div className="textHolder">
//                     <p className="songText">{artist}</p>
//                     <p className="songText"> {title}</p>
//                 </div>
//                 <FontAwesomeIcon className="songIcon2"
//                 icon={faPlus} onClick={() => props.addToQuery(id, title)}/>
//             </div>
//         <div className="part2">
//             <FontAwesomeIcon className="songIcon2" icon={faPlay} onClick={() => props.playSong(uri, id)} />
//         </div>

//         </div>
//     )
// }