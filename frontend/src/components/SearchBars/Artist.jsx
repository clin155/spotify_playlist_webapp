import { useEffect, useState } from "react"
import placeholder from "./../../static/images/placeholder.jpg";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function Artist(props) {
    const [coverImg, setcoverImg] = useState(placeholder); 
    const { imgUrl, artist, ext_url, id } = props;
    
    console.log(ext_url)
    useEffect(() => {
        if (!imgUrl) return;
        setcoverImg(imgUrl);
    },[imgUrl])

    return (
        <div className="playlistrow2">
        <div className="part1">
            <a href={ext_url}><img className="cover" src={coverImg} alt={"placeholder"}></img></a>
            <p>{artist}</p>
        </div>
        <div className="part2">
            <FontAwesomeIcon className="songIcon2" icon={faPlus} onClick={() => props.addToQuery(id, artist)}/>
        </div>
        </div>
    )
}