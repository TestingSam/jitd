import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import BaseComponent from "./BaseComponent";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" component={BaseComponent} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
