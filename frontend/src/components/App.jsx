import './Global.scss';
import "bootstrap/dist/css/bootstrap.min.css";

import {
  BrowserRouter,Routes,Route,Navigate,
} from "react-router-dom";
import { useState } from 'react';

import {Home} from "./Home";
import { Login, Callback} from "./Login";

function App(props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState();
  console.log(loggedIn);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" 
        element = {loggedIn ? <Home accessToken={accessToken}/> : <Navigate to="/login"/>}/>
        <Route path="/login" element = {loggedIn ? <Navigate to="/" /> : <Login loginFunc={loginUrl}/>} />
        <Route path="/callback" element = {<Callback setLoggedIn={setLoggedIn}
         setAccessToken={setAccessToken} />} />
      </Routes>
    </BrowserRouter>
  );
}

function loginUrl() {
  let state = generateString(16);
  let scope = 'user-read-private user-read-email';
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: "c0e9a860fcb745ba8d5f1057781404f0",
    scope: scope,
    redirect_uri: "http://localhost:3000/callback/",
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
