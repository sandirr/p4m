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
          <Route path={['/', '/beranda']} exact component={pages.Home} />
          <Route path={['/area-mentor/:roomId', '/sesi/:roomId']} exact component={pages.Room} />
        </Switch>
      </Router>
    </Fragment>
  );
}

export default App;
