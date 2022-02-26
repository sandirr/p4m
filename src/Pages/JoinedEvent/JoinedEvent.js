import React, {Component} from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Paper, Tab, Tabs, TextField, Typography, LinearProgress, linearProgressClasses } from '@mui/material';
import { AccessTimeRounded, GroupsRounded } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { SearchRounded } from '@mui/icons-material';
import { Colors } from '../../Configs';
import { Fragment } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { firestore, fAuth } from '../../Configs/firebase';
import moment from 'moment';
import { parseMoney } from '../../Helpers';

export default class JoinedEvent extends Component{

  constructor(props){
    super(props);
    this.state = {
      activeTab:'',
      events:[],
      serachTerm:''
    };
  }

  componentDidMount(){
    this._getEventsEvents();
  }

  _getEventsEvents = () => {
    const {activeTab} = this.state;
    const now = new Date();
    let q = query(collection(firestore, 'events'), where('joined', 'array-contains', fAuth.currentUser?.uid));
    
    if(activeTab === 'active')
      q = query(collection(firestore, 'events'), where('joined', 'array-contains', fAuth.currentUser?.uid), where('eventEnded', '>=', now));
    else if(activeTab === 'done')
      q = query(collection(firestore, 'events'), where('joined', 'array-contains', fAuth.currentUser?.uid), where('eventEnded', '<', now));
    else
      q = query(collection(firestore, 'events'), where('joined', 'array-contains', fAuth.currentUser?.uid));

    onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        const matchSearch = docData.eventTitle.toLowerCase().match(this.state.serachTerm.toLowerCase());
        if(matchSearch)
          data.push({...docData, eventId: doc.id});
      });
      this.setState({events: data});
    }, (err)=> console.log(err));
  }

  _handleChangeTab = (e, activeTab) => {
    this.setState({activeTab}, this._getEventsEvents);
  };

  _handleSearchEvents = (e) => {
    this.setState({serachTerm: e.target.value}, this._getEventsEvents);
  }

  _handleToDetail = (id) => () => {
    this.props.history.push(`/event/${id}`);
  }

  render(){
    const {activeTab, events, serachTerm} = this.state;
    const {classes} = this.props;
    return(
      <Fragment>
        <Grid container spacing={2} alignItems="center" className={classes.root}>
          <Grid item lg={8} xs={12} className="sticky">
            <Paper className={classes.paperBar} >
              <Tabs 
                value={activeTab} 
                indicatorColor={null}
                onChange={this._handleChangeTab} 
                className={classes.tabs}
                variant="scrollable"
                scrollButtons="auto">
                <Tab className="tab" value="" label="Semua" />
                <Tab className="tab" value="active" label="Event Aktif" />
                <Tab className="tab" value="done" label="Event Selesai" />
                {/* <Tab className="tab" label="Draft" /> */}
              </Tabs>
            </Paper>
          </Grid>
          <Grid item lg={4} xs={12} className="sticky">
            <Paper className={classes.paperBar}>
              <TextField 
                placeholder="Cari kursus membuat website" 
                size="small" 
                variant="outlined"
                value={serachTerm}
                onChange={this._handleSearchEvents}
                fullWidth
                sx={{padding:'3px 0'}}
                InputProps={{
                  startAdornment:(
                    <SearchRounded sx={{marginRight:1, color: Colors.primary}} />
                  ),
                  // endAdornment:(
                  //   <IconButton>
                  //     <Badge color="error" variant="dot">
                  //       <FilterListRounded sx={{color: Colors.primary}} />
                  //     </Badge>
                  //   </IconButton>
                  // ),
                  classes:{notchedOutline:classes.noBorder}
                }}
              />
            </Paper>
          </Grid>
          {events.map(e=>(
            <Grid item lg={4} md={6} xs={12} xl={3} key={e.eventCover}>
              <Card className="card-item" >
                <CardActionArea onClick={this._handleToDetail(e.eventId)}>
                  <CardMedia
                    component="img"
                    height="150"
                    image={e.eventCover}
                    alt="green iguana"
                  />
                  <div className="category" >{e.eventCategories[0]}</div>
                  <CardContent>
                    <Typography variant="body2" className="event-date">
                      <AccessTimeRounded className="desc-icon" />
                      <span>
                        {moment(e.eventStarted.seconds * 1000).format('dddd, Do MMMM YYYY')}
                      </span>
                    </Typography>
                    <Typography variant="body1" className="event-title">
                      {e.eventTitle}
                    </Typography>
                    <Typography variant="body1" className="price">
                      {e.eventPrice ? `Rp ${parseMoney(e.eventPrice)}` : 'Gratis'}
                    </Typography>
                    <div variant="body2" className="joined">
                      <GroupsRounded className="desc-icon" />
                      <div style={{width:'100%'}}>
                        <LinearProgress sx={progressStyle} variant="determinate" value={(e.joined?.length || 0)/e.eventClass * 100} />
                      </div>
                      <span className="participants" >{(e.joined?.length||0)}/{e.eventClass}</span>
                    </div>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Fragment>
    );
  }
}

const progressStyle ={
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: Colors.error_light,
    borderRadius:25,
    height:5
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 25,
    backgroundColor: Colors.primary_light,
  },
};

JoinedEvent.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
  mediaQuery: PropTypes.bool,
  history:PropTypes.object,
};
  
JoinedEvent.defaultProps = {
  classes: {},
  children: null,
  history:{}
};