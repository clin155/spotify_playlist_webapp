import { useState, useEffect } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import placeholder from "./../../static/images/placeholder.jpg";

export function Playlist(props) {
    const [ coverImg, setCoverImg ] = useState(placeholder);

    const config = {
        headers: { Authorization: `Bearer ${props.token}`,
        "Access-Control-Allow-Origin": "*" }
        
    };
    useEffect(() => {
        console.log(config)
        axios.get(`https://api.spotify.com/v1/playlists/${props.id}/images`,
        {},
        config)
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            })
    })

    return (
        <Row>
            <Col xs={6}><img className="cover" src={coverImg} alt={"placeholder"}></img></Col>
        </Row>
    )
}   