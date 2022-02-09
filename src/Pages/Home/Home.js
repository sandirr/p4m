/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Paper, Tab, Tabs, TextField, Typography, IconButton, LinearProgress, linearProgressClasses, Badge } from '@mui/material';
import { AccessTimeRounded, GroupsRounded, FilterListRounded } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { SearchRounded } from '@mui/icons-material';
import { Colors } from '../../Configs';
import { Fragment } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { firestore } from '../../Configs/firebase';
import moment from 'moment';
import { parseMoney } from '../../Helpers';

export default class Home extends Component{

  constructor(props){
    super(props);
    this.state = {
      activeTab:0,
      events:[]
    };
  }

  componentDidMount(){
    this._getEventsEvents();
  }

  _getEventsEvents = () => {
    // console.log(fAuth.currentUser?.uid);
    const q = query(collection(firestore, 'events'));
    onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({...doc.data(), eventId: doc.id});
      });
      this.setState({events: data});
    });
  }

  _handleChangeTab = (e, activeTab) => {
    this.setState({activeTab});
  };

  _handleToDetail = (id) => () => {
    this.props.history.push(`/beranda/${id}`);
  }

  render(){
    const {activeTab, events} = this.state;
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
                <Tab className="tab" label="Semua" />
                <Tab className="tab" label="Informatika" />
                <Tab className="tab" label="Design & Kreatif" />
                <Tab className="tab" label="Bahasa & Sastra" />
                <Tab className="tab" label="Agama" />
                <Tab className="tab" label="Manajemen" />
                <Tab className="tab" label="Ekonomi & Perbankan" />
                <Tab className="tab" label="Dakwah & Komunikasi" />
                <Tab className="tab" label="Hukum" />
                <Tab className="tab" label="Kesehatan" />
              </Tabs>
            </Paper>
          </Grid>
          <Grid item lg={4} xs={12} className="sticky">
            <Paper className={classes.paperBar}>
              <TextField 
                placeholder="Cari kursus membuat website" 
                size="small" 
                variant="outlined"
                fullWidth
                sx={{padding:'3px 0'}}
                InputProps={{
                  startAdornment:(
                    <SearchRounded sx={{marginRight:1, color: Colors.primary}} />
                  ),
                  endAdornment:(
                    <IconButton>
                      <Badge color="error" variant="dot">
                        <FilterListRounded sx={{color: Colors.primary}} />
                      </Badge>
                    </IconButton>
                  ),
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
                        {moment(e.rangeDate[0].seconds * 1000).format('dddd, Do MMMM YYYY')}
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

Home.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
  mediaQuery: PropTypes.bool,
  history:PropTypes.object,
};
  
Home.defaultProps = {
  classes: {},
  children: null,
  history:{}
};