import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import logo from './assets/logo-queen.png';
import Player from './components/Player';
import AddSong from './components/AddSong';
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <img className="logo" alt="logo"  src={logo}/>
          <Switch>
            <Route exact path="/">
              <Player />
            </Route>
            <Route path="/add">
              <AddSong />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
