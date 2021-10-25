import React, { Fragment } from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import pages from './Pages';

function App() {
  return (
    <Fragment>
      <Router>
        <Switch>
          <Route path="/" component={pages.Home} />
        </Switch>
      </Router>
    </Fragment>
  );
}

export default App;
