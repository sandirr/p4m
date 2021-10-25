import React, {Component} from 'react';
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Paper, Tab, Tabs, TextField, Typography } from '@mui/material';
import {PageBase} from '../../Elements';
import PropTypes from 'prop-types';
import { SearchRounded } from '@mui/icons-material';
import { Colors } from '../../Configs';

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

  render(){
    const {activeTab} = this.state;
    const {classes} = this.props;
    console.log(this.matches);
    return(
      <PageBase>
        <Grid container spacing={2} alignItems="center" >
          <Grid item lg={8} xs={12}>
            <Paper className={classes.tabs}>
              <Tabs 
                value={activeTab} 
                indicatorColor={null}
                onChange={this._handleChangeTab} 
                variant="scrollable"
                scrollButtons="auto">
                <Tab sx={{textTransform:'none'}} label="Informatika" />
                <Tab sx={{textTransform:'none'}} label="Design & Kreatif" />
                <Tab sx={{textTransform:'none'}} label="Bahasa & Sastra" />
                <Tab sx={{textTransform:'none'}} label="Informatika" />
                <Tab sx={{textTransform:'none'}} label="Design & Kreatif" />
                <Tab sx={{textTransform:'none'}} label="Bahasa & Sastra" />
              </Tabs>
            </Paper>
          </Grid>
          <Grid item lg={4} xs={12} justifyContent="flex-end">
            <Paper className={classes.tabs}>
              <TextField 
                placeholder="Cari kursus membuat website" 
                size="small" 
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment:(
                    <SearchRounded sx={{marginRight:1, color: Colors.primary}} />
                  ),
                  disableUnderline: true,
                  classes:{notchedOutline:classes.noBorder}
                }}
              />
            </Paper>
          </Grid>
          <Grid item lg={4} md={6} xs={12} xl={3} >
            <Card sx={{boxShadow:'none'}}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Lizard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                    Share
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item lg={4} md={6} xs={12} xl={3} >
            <Card sx={{boxShadow:'none'}}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Lizard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                    Share
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item lg={4} md={6} xs={12} xl={3} >
            <Card sx={{boxShadow:'none'}}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Lizard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                    Share
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item lg={4} md={6} xs={12} xl={3} >
            <Card sx={{boxShadow:'none'}}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Lizard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                    Share
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item lg={4} md={6} xs={12} xl={3} >
            <Card sx={{boxShadow:'none'}}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Lizard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                    Share
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item lg={4} md={6} xs={12} xl={3} >
            <Card sx={{boxShadow:'none'}}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Lizard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                    Share
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item lg={4} md={6} xs={12} xl={3} >
            <Card sx={{boxShadow:'none'}}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Lizard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                    Share
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item lg={4} md={6} xs={12} xl={3} >
            <Card sx={{boxShadow:'none'}}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Lizard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                    Share
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item lg={4} md={6} xs={12} xl={3} >
            <Card sx={{boxShadow:'none'}}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Lizard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                    Share
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item lg={4} md={6} xs={12} xl={3} >
            <Card sx={{boxShadow:'none'}}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Lizard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                    Share
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item lg={4} md={6} xs={12} xl={3} >
            <Card sx={{boxShadow:'none'}}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Lizard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                    Share
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item lg={4} md={6} xs={12} xl={3} >
            <Card sx={{boxShadow:'none'}}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Lizard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                    Share
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </PageBase>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
  mediaQuery: PropTypes.bool
};
  
Home.defaultProps = {
  classes: {},
  children: null
};