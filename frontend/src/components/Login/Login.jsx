import React from "react";
import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';


export function Login(props) {

    function loginUrl() {
        let state = generateString(16);
        let scope = 'user-read-private user-read-email';
        const params = new URLSearchParams({
          response_type: 'code',
          client_id: "c0e9a860fcb745ba8d5f1057781404f0",
          scope: scope,
          redirect_uri: "http://localhost:3000/callback",
          state: state
          }).toString();
        return 'https://accounts.spotify.com/authorize?' + params;
    }
    
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
            href={loginUrl()}>Login with Spotify</a>
        </Row>
        </Container>

    )
}

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}