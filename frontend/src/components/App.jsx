import './Global.scss';
import "bootstrap/dist/css/bootstrap.min.css";

import {
  BrowserRouter,Routes,Route,Navigate,
} from "react-router-dom";
import { useState, useEffect } from 'react';

import {Home} from "./Home";
import { Login, Callback} from "./Login";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_CLIENT_ID,
})

function App(props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState();
  
  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route exact path="/" 
        element = {loggedIn ? <Home accessToken={accessToken} spotifyApi={spotifyApi}/> : <Navigate to="/login"/>}/>
        <Route exact path="/login" element = {loggedIn ? <Navigate to="/" /> : <Login loginFunc={loginUrl}/>} />
        <Route exact path="/callback" element = {<Callback setLoggedIn={setLoggedIn}
         setAccessToken={setAccessToken} />} />
      </Routes>
    </BrowserRouter>
  );
}

function loginUrl() {
  let state = generateString(16);
  let scope = 'playlist-modify-private playlist-modify-public playlist-read-private user-read-private user-read-email streaming user-read-playback-state user-modify-playback-state user-library-read user-library-modify';
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.REACT_APP_CLIENT_ID,
    scope: scope,
    redirect_uri: process.env.REACT_APP_HOST_URL + "/callback/",
    state: state
    }).toString();
  return 'https://accounts.spotify.com/authorize?' + params;
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

export default App;
