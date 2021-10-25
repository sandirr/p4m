/* eslint-disable react/prop-types */
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ChevronLeftRounded, ErrorRounded, GroupWork, HelpRounded, HomeRounded, ImportantDevicesRounded, Logout, NotificationsRounded, PaymentsRounded } from '@mui/icons-material';
import {Colors, Images} from '../../Configs';
import { Avatar, Grid, Slide, Typography, useScrollTrigger } from '@mui/material';
import PropTypes from 'prop-types';

const drawerWidth = 260;

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PageBase(props) {
  const {classes} = props;
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [open, setOpen] = React.useState(matches);

  //   console.log(matches)
  React.useEffect(()=>{
    setOpen(matches);
  },[matches]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box className={classes.root} >
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar position="fixed" open={open} sx={{background:Colors.white, boxShadow:`0px 1px 4px ${Colors.grey40}`}} >
          <Toolbar>
            <Grid container justifyContent="space-between" alignItems="center" wrap="nowrap">
              <Grid item>
                <IconButton
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{ mr: open ? 0 : 2, color:Colors.black, ...(open && { display: 'none' }) }}
                >
                  {!open && <MenuIcon />} 
                </IconButton>
                {!open &&
                <span variant="body1" component="div" style={{color:Colors.black}}>
                  P4M
                </span>
                }
              </Grid>
              <Grid item>
                <div style={{display: 'flex', alignItems:'center'}}>
                  <div>
                    <IconButton>
                      <NotificationsRounded sx={{fontSize:20, color:Colors.black}} />
                    </IconButton>
                  </div>
                  <div style={{display:'flex', alignItems:'center', margin:'0 14px'}}>
                    <Avatar sx={{backgroundColor:Colors.info_light, color:Colors.info, fontWeight:'bold'}} >AI</Avatar>
                    {matches &&
                    <div style={{marginLeft:10}} >
                      <div style={{color:Colors.black, fontWeight:400}} >Andi Irsandi R.</div>
                      <div style={{color:Colors.grey60, fontSize:12, marginTop:-5}} >UIN Alauddin Makassar</div>
                    </div> 
                    }
                  </div>
                  <IconButton>
                    <Logout sx={{fontSize:20, color:Colors.black}} /> 
                  </IconButton>
                </div>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Drawer
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRadius:'0 0 16px 0',
            border:'none',
            boxShadow:`1px 0px 4px ${Colors.grey40}`,
            overflow:'hidden'
          },
          position:'relative',
        }}
        variant={ matches ? 'persistent': 'temporary' }
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
      >
        <Toolbar style={{boxShadow:`0px 1px 4px ${Colors.grey40}`}}>
          P4M
        </Toolbar>
        <List style={{padding:'24px 10px 0'}}>
          <ListItem button className={classes.listItem}>
            <ListItemIcon>
              <HomeRounded className="list-icon" />
            </ListItemIcon>
            <ListItemText className="list-text" primary="Beranda" />
          </ListItem>
          <Typography className={classes.listHead} >Sesi</Typography>
          <ListItem button className={classes.listItemActive}>
            <ListItemIcon>
              <GroupWork className="list-icon" />
            </ListItemIcon>
            <ListItemText className="list-text" primary="Sesi Diikuti" />
          </ListItem>
          <ListItem button className={classes.listItem}>
            <ListItemIcon>
              <PaymentsRounded className="list-icon" />
            </ListItemIcon>
            <ListItemText className="list-text" primary="Pembayaran" />
          </ListItem>
          <ListItem button className={classes.listItem}>
            <ListItemIcon>
              <ImportantDevicesRounded className="list-icon" />
            </ListItemIcon>
            <ListItemText className="list-text" primary="Area Mentor" />
          </ListItem>
          <Typography className={classes.listHead}>Lainnya</Typography>
          <ListItem button className={classes.listItem}>
            <ListItemIcon>
              <ErrorRounded className="list-icon" />
            </ListItemIcon>
            <ListItemText className="list-text" primary="Bantuan" />
          </ListItem>
          <ListItem button className={classes.listItem}>
            <ListItemIcon>
              <HelpRounded className="list-icon" />
            </ListItemIcon>
            <ListItemText className="list-text" primary="FAQ" />
          </ListItem>
        </List>
        <div style={{position:'absolute', bottom:10, right:5, zIndex:2}} >
          <IconButton onClick={handleDrawerClose} >
            <ChevronLeftRounded style={{fontSize:36}} />
          </IconButton>
        </div>
        <img src={Images.SILINDER} alt="silinder" style={{position:'absolute', bottom:0, left:0, right:0, zIndex:-1}} />
      </Drawer>
      <Main open={open || !matches} style={{overflowY:'auto'}} >
        <DrawerHeader />
        {props.children}
      </Main>
    </Box>
  );
}

PageBase.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node
};

PageBase.defaultProps = {
  classes: {},
  children: null
};