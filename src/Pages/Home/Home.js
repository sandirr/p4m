/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Paper, Tab, Tabs, TextField, Typography, IconButton, LinearProgress, linearProgressClasses, Badge } from '@mui/material';
import { AccessTimeRounded, GroupsRounded, FilterListRounded } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { SearchRounded } from '@mui/icons-material';
import { Colors } from '../../Configs';
import { Fragment } from 'react';

export default class Home extends Component{

  constructor(props){
    super(props);
    this.state = {
      activeTab:0
    };
  }

  _handleChangeTab = (e, activeTab) => {
    this.setState({activeTab});
  };

  _handleToDetail = (id) => () => {
    this.props.history.push(`/beranda/${id}`);
  }

  render(){
    const {activeTab} = this.state;
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
          {[1,2,3,4,5,6,7,8].map(e=>(
            <Grid item lg={4} md={6} xs={12} xl={3} key={e}>
              <Card className="card-item" onClick={this._handleToDetail('apakah')} >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="150"
                    image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                    alt="green iguana"
                  />
                  <div className="category" >Teknologi</div>
                  <CardContent>
                    <Typography variant="body2" className="event-date">
                      <AccessTimeRounded className="desc-icon" />
                      <span>
                      Kamis, 20 Agustus 2021
                      </span>
                    </Typography>
                    <Typography variant="body2" className="event-title">
                    Workshop Peningkatan Kompetensi Guru dalam Membuat Media Pembelajaran Berbasis IT
                    </Typography>
                    <Typography variant="body1" className="price">
                    Rp200.000
                    </Typography>
                    <Typography variant="body2" className="joined">
                      <GroupsRounded className="desc-icon" />
                      <div style={{width:'100%'}}>
                        <LinearProgress sx={progressStyle} variant="determinate" value={12/25 * 100} />
                      </div>
                      <span className="participants" >12/25</span>
                    </Typography>
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