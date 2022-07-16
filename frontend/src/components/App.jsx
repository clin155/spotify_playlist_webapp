import './Global.scss';
import "bootstrap/dist/css/bootstrap.min.css";

import {
  BrowserRouter,Routes,Route,Navigate,
} from "react-router-dom";
import {Home} from "./Home";
import {Login} from "./Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" 
        element = {false ? <Home /> : <Navigate to="/login"/>}/>
        <Route path="/login" element = {<Login/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
