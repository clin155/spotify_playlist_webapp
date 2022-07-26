import React from "react";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import { useEffect } from "react";
import axios from "axios";

export function Login(props) {

    useEffect(() => {
        if (!props.loggedIn) {
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/login/`,{ withCredentials: true })
            .then((response) => {
              if (response.data.loggedIn) {
                window.location = props.loginFunc()
              }
            })
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
      
    return(
        <Container className="d-flex justify-content-around align-items-center flex-column" 
        style={{"maxWidth": "80%", "marginTop": "5%"}}>
        <Row>
            <div>
                <h1>Spotify Music Discovery &amp; Playlist Manager</h1>
                <p className="text-justify">Hi! This is an app to quickly discover music and generate playlists using the Spotify
                    Web API. Click the buttton below to login with your Spotify Account.
                </p>
            </div>
        </Row>
        <Row>
            <a className="btn btn-success btn-lg" 
            href={props.loginFunc()}>Login with Spotify</a>
        </Row>
        </Container>

    )
}

