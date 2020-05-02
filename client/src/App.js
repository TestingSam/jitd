import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import HomePage from "./HomePage";
import GetCollection from "./GetCollection";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/GetAPIS" component={GetCollection} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
