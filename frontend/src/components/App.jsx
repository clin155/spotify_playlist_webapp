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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" 
        element = {loggedIn ? <Home accessToken={accessToken}/> : <Navigate to="/login"/>}/>
        <Route path="/login" element = {<Login />} />
        <Route path="/callback" element = {<Callback setLoggedIn={setLoggedIn}
         setAccessToken={setAccessToken} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
