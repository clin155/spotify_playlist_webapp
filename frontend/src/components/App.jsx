import './Global.scss';
import "bootstrap/dist/css/bootstrap.min.css";

import {
  BrowserRouter,Routes,Route,Navigate,
} from "react-router-dom";
import { useState } from 'react';
import axios from "axios";

import {Home} from "./Home";
import {Callback, Login} from "./Login";


function App(props) {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" 
        element = {loggedIn ? <Home /> : <Navigate to="/login"/>}/>
        <Route path="/login" element = {<Login />} />
        <Route path="/callback" element = {<Callback setLoggedIn={setLoggedIn}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
