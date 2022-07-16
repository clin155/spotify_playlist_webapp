import './Global.scss';
import {
  BrowserRouter,Routes,Route,Redirect,
} from "react-router-dom";
import {Home} from "./Home"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" 
        element = {true ? <Home /> : <Redirect to="/login"/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
