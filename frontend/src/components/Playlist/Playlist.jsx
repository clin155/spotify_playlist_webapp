import { useState, useEffect } from 'react';
// import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import placeholder from "./../../static/images/placeholder.jpg";

export function Playlist(props) {
    const [ coverImg, setCoverImg ] = useState(placeholder);

    useEffect(() => {
        const { data } = props;
        if (data.images.length > 0) {
            setCoverImg(data.images[0]["url"])

        }
    }, [props])
    return (
        <Row>
            <Col><img className="cover" src={coverImg} alt={"placeholder"}></img></Col>
            <Col><p>{props.data.name}</p></Col>
        </Row>
    )
}   