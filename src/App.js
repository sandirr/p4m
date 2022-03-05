import React, { Fragment } from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import pages from './Pages';
import { PageBase } from './Elements';
import { AdminList, fAuth } from './Configs';
import moment from 'moment';
import id from 'moment/locale/id';
moment.locale('id', id);

function App() {
  const [userLogin,setuserLogin] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [admin, setAdmin] = React.useState(false);

  React.useEffect(()=>{
    moment.locale('id');
    setLoading(true);
    fAuth.onAuthStateChanged(user=>{
      if(user){
        setuserLogin(user);
        if(AdminList.includes(user.uid)){
          setAdmin(true);
        }
      } else setuserLogin(null);
      setLoading(false);
    });
  },[]);
  return (
    <Fragment>
      {loading ? 'Loading...' :
        <Router>
          <PageBase userLogin={userLogin} admin={admin}>
            <Switch>

              <Route path={['/', '/beranda']} exact component={pages.Home} />
              <Route path={'/area-mentor'} exact component={pages.MentorArea} />
              {admin &&
                <Route path={'/area-admin'} exact component={pages.AdminArea} />
              }
              {admin &&
                <Route path={'/area-admin/:eventId'} exact component={pages.EventDetails} />
              }
              <Route path={'/event'} exact component={pages.JoinedEvent} />
              <Route path={'/pembayaran'} exact component={pages.Payment} />
              <Route path={['/area-mentor/:eventId/meet', '/event/:eventId/meet']} exact component={pages.JitsiMeet} />
              <Route path={['/beranda/:eventId', '/area-mentor/:eventId', '/event/:eventId']} exact component={pages.EventDetails} />

            </Switch>
          </PageBase>
        </Router>
      }
    </Fragment>
  );
}

export default App;
