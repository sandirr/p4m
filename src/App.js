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
          <Route path={['/area-mentor/:sesiId', '/sesi/:sesiId']} exact component={pages.Room} />
          <Route path='/detail-sesi/:sesiId' exact component={pages.DetailSesi} />
        </Switch>
      </Router>
    </Fragment>
  );
}

export default App;
