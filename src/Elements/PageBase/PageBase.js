/* eslint-disable no-unused-vars */
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
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useHistory} from 'react-router-dom';
import { AdminPanelSettings, ChevronLeftRounded, ErrorRounded, Google, GroupWork, HelpRounded, HomeRounded, ImportantDevicesRounded, Login, Logout, MenuRounded, NotificationsRounded, PaymentsRounded, SendRounded } from '@mui/icons-material';
import {Colors, Images} from '../../Configs';
import { Alert, Avatar, Button, Grid, Slide, Snackbar, TextField, Typography, useScrollTrigger, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';
import ConfirmationModal from '../ConfirmationModal';
import PopUp from '../PopUp';
import { fAuth } from '../../Configs';
import { RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, signInWithPopup, signOut, ConfirmationResult, signInWithRedirect } from '@firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firestore, storage } from '../../Configs/firebase';
import LengkapiData from '../LengkapiData';
import { getDownloadURL, ref } from 'firebase/storage';
import { useLocation } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom';
import { userLib } from '../../Helpers';

const drawerWidth = 260;

function HideOnScroll(props) {
  const { children, window, scrollTarget } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : scrollTarget,
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
  const {classes, pageTitle, activePage, userLogin, admin} = props;
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const history = useHistory();
  const [open, setOpen] = React.useState(matches);
  const [pop, setPop] = React.useState('');

  const [hp, setHp] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [loadingVerif, setLoadingVerif] = React.useState('');

  const [userData, setUserData] = React.useState(null);

  React.useEffect(()=>{
    if(userLogin)
      checkUser(userLogin);
    else setPop('');
  },[userLogin, fAuth.currentUser]);

  const [loginWarning, setLoginWarning] = React.useState(true);

  //   console.log(matches)
  React.useEffect(()=>{
    setOpen(matches);
  },[matches]);

  const [scrollTarget] = React.useState(undefined); 

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const setUpRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {'size': 'invisible',}, fAuth);
  };

  const changeRoute = (to) => () => {
    history.push(`/${to}`);
    handleDrawerClose();
  };

  const setNumber = (e) =>{
    const newVal = e.target.value?.replace(/[^0-9]/g, '');
    if(newVal !== '0' && newVal.length <= 13)
      setHp(newVal);
  };

  const setOTPNumber = (e) =>{
    const newVal = e.target.value?.replace(/[^0-9]/g, '');
    if(newVal !== '0')
      setOtp(newVal);
  };

  const loginWithPhone = async () =>{
    setLoadingVerif('load');
    setUpRecaptcha();
    const appVerifier = await window.recaptchaVerifier;
    await signInWithPhoneNumber(fAuth, `+62${hp}`, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        // handleRedirect();
      // ...
      }).catch((error) => {
      // Error; SMS not sent
        console.log(error);
      // ...
      });
    setLoadingVerif('needVerif');
  };

  const confirmOTP = async () => {
    setLoadingVerif('load');
    await window.confirmationResult.confirm(otp).then((result) => {
      // User signed in successfully.
      const user = result.user;
      // ...
    }).catch((error) => {
      // User couldn't sign in (bad verification code?)
      // ...
    });
    setHp('');
    setOtp('');
    setLoadingVerif('');
  };

  const loginWithGmail = async () =>{
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(fAuth, provider);
  };

  const openPop = (openFor) => () => {
    setPop(openFor);
  };

  const checkUser = async (user) =>{
    const userRef = doc(firestore, `users/${user.uid || fAuth.currentUser.uid}`);
    const userSnap = await getDoc(userRef);
    if(!userSnap.exists()){
      setPop('profil');
    }else{
      setPop('');
      const userSnapData = userSnap.data();
      const fileRef = ref(storage, `profile-picutre/${fAuth.currentUser.uid}`);
      await getDownloadURL(fileRef)
        .then(url=>{
          userSnapData.photoUrl = url;
        }).catch((err)=>{
          console.log(err.message);
        });
      setUserData(userSnapData);
      userLib.data = userSnapData;
    }
  };

  const updateUser = (newData)=> {
    setUserData(newData);
    userLib.data = newData;
    setPop('');
  };

  const checkSign = () => {
    if(userLogin){
      setPop('signout');
    }else{
      setLoginWarning(false);
      setPop('signin');
    }
  };

  const handleLogout = () =>{
    signOut(fAuth).then(()=>{
      // console.log('success logout');
      userLib.data = {};
      history.replace('/beranda');
    }).catch(err=>{
      alert(err.message);
    });
  };

  return (
    <Box className={classes.root} >
      <CssBaseline />
      <HideOnScroll {...props} scrollTarget={scrollTarget}>
        <AppBar position="fixed" open={open} sx={{background:Colors.white, boxShadow:`0px 1px 4px ${Colors.grey40}`}} >
          <Toolbar>
            <Grid container justifyContent="space-between" alignItems="center" wrap="nowrap">
              <Grid item>
                <div style={{display:'flex', alignItems:'center'}}>
                  <IconButton
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{ mr: open ? 0 : 2, color:Colors.black, ...(open && { display: 'none' }) }}
                  >
                    {!open && <MenuRounded />} 
                  </IconButton>
                  {!open &&
                    <img alt="p4m" src={Images.LOGO} width={40} height={40} />
                  }
                </div>
              </Grid>
              <Grid item>
                <div style={{display: 'flex', alignItems:'center'}}>
                  {userLogin &&
                    <div>
                      <IconButton id="sign-in-button">
                        <NotificationsRounded sx={{fontSize:20, color:Colors.black}} />
                      </IconButton>
                    </div>
                  }
                  {userLogin &&
                    <div style={{display:'flex', alignItems:'center', margin:'0 14px'}} onClick={openPop('profil')}>
                      <Avatar sx={{backgroundColor:Colors.info_light, color:Colors.info, fontWeight:'bold'}} src={userData?.photoUrl || userLogin?.photoURL} ></Avatar>
                      {matches &&
                      <div style={{marginLeft:10}} >
                        <div style={{color:Colors.black, fontWeight:400}} >{userData?.fullName || userLogin?.displayName || ''}</div>
                        <div style={{color:Colors.grey60, fontSize:12, marginTop:-5}} >{userData?.university || userData?.status || ''}</div>
                      </div> 
                      }
                    </div>
                  }
                  <div>
                    <IconButton onClick={checkSign} >
                      {userLogin ?
                        <Logout sx={{fontSize:20, color:Colors.black}} style={{marginTop:-6}} /> 
                        :
                        <Login sx={{fontSize:20, color:Colors.black}} style={{marginTop:-6}} /> 
                      }
                    </IconButton>
                    {userLogin ?
                      <div style={{textAlign:'center', marginTop:-10, fontSize:8, color:'#000', fontWeight:'500'}}>Logout</div>
                      :
                      <div style={{textAlign:'center', marginTop:-10, fontSize:8, color:'#000', fontWeight:'500'}}>Login</div>
                    }
                  </div>
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
        <Toolbar style={{boxShadow:`0px 1px 4px ${Colors.grey40}`, }}>
          <div style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
            <img alt="p4m" src={Images.LOGO} width={50} height={50} />
          </div>
        </Toolbar>
        <List style={{padding:'24px 10px 0'}}>
          <ListItem onClick={changeRoute('beranda')} button className={useRouteMatch(['/beranda', '/beranda/:eventId']) ? classes.listItemActive : classes.listItem}>
            <ListItemIcon>
              <HomeRounded className="list-icon" />
            </ListItemIcon>
            <ListItemText className="list-text" primary="Beranda" />
          </ListItem>
          <ListItem onClick={changeRoute('area-mentor')} disabled={!userLogin} button className={useRouteMatch(['/area-mentor', '/area-mentor/:eventId']) ? classes.listItemActive : classes.listItem}>
            <ListItemIcon>
              <ImportantDevicesRounded className="list-icon" />
            </ListItemIcon>
            <ListItemText className="list-text" primary="Area Mentor" />
          </ListItem>
          {admin &&
          <ListItem onClick={changeRoute('area-admin')} disabled={!userLogin} button className={useRouteMatch(['/area-admin', '/area-admin/:eventId']) ? classes.listItemActive : classes.listItem}>
            <ListItemIcon>
              <AdminPanelSettings className="list-icon" />
            </ListItemIcon>
            <ListItemText className="list-text" primary="Area Admin" />
          </ListItem>
          }
          <Typography className={classes.listHead} >Event</Typography>
          <ListItem onClick={changeRoute('event')} disabled={!userLogin} button className={useRouteMatch(['/event', '/event/:eventId']) ? classes.listItemActive : classes.listItem}>
            <ListItemIcon>
              <GroupWork className="list-icon" />
            </ListItemIcon>
            <ListItemText className="list-text" primary="Event Diikuti" />
          </ListItem>
          <ListItem onClick={changeRoute('pembayaran')} disabled={!userLogin} button className={useRouteMatch(['/pembayaran', '/pembayaran/:eventId']) ? classes.listItemActive : classes.listItem}>
            <ListItemIcon>
              <PaymentsRounded className="list-icon" />
            </ListItemIcon>
            <ListItemText className="list-text" primary="Pembayaran" />
          </ListItem>
          <Typography className={classes.listHead}>P4M Care</Typography>
          <ListItem onClick={changeRoute('bantuan')} button className={useRouteMatch('/bantuan') ? classes.listItemActive : classes.listItem}>
            <ListItemIcon>
              <ErrorRounded className="list-icon" />
            </ListItemIcon>
            <ListItemText className="list-text" primary="Bantuan" />
          </ListItem>
          <ListItem onClick={changeRoute('faq')}button className={useRouteMatch('/faq') ? classes.listItemActive : classes.listItem}>
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
      <Main open={open || !matches} sx={{overflowY:'auto', minHeight:'100vh'}} 
        // ref={node => {
        //   if (node) {
        //     setScrollTarget(node);
        //   }
        // }}
      >
        <DrawerHeader />
        
        <Snackbar anchorOrigin={{vertical:'bottom', horizontal:'center'}} open={loginWarning && !userLogin}>
          <Alert sx={{mb:2}} severity="warning" variant="filled" onClose={() => setLoginWarning(false)}>Yuk <strong style={{cursor:'pointer', textDecoration:'underline'}} onClick={checkSign}>login</strong>! Kamu perlu login agar bisa mengakses semua fitur</Alert>
        </Snackbar>
        {props.children}
        <ConfirmationModal open={pop === 'signout'} title="Logout" desc="Apakah kamu yakin ingin logout?" handleAgree={handleLogout} agreeText="Keluar" handleClose={()=> setPop(false)} />
        
        <PopUp noNext={true} open={pop === 'signin'} title="Login" disagreeText="Batal" handleClose={()=> setPop(false)} >
          <div style={{textAlign:'center'}}>
            {loadingVerif === 'load' ?
              <CircularProgress size={60}/> :
              loadingVerif === 'needVerif' ?
                <React.Fragment>
                  <Typography>Kami telah mengirimkan kode rahasia ke nomor kamu +62{hp}</Typography>
                  <TextField
                    size='small' 
                    label="Kode Verifikasi / OTP" 
                    fullWidth 
                    sx={{marginTop:1}}
                    value={otp}
                    inputMode='numeric'
                    onChange={setOTPNumber}
                    InputProps={{
                      endAdornment:(
                        <IconButton sx={{marginRight:-1}} disabled={otp.length < 6} onClick={confirmOTP}>
                          <SendRounded htmlColor={Colors.grey90} fontSize='small' />
                        </IconButton>)
                    }} 
                  />
                </React.Fragment>:
                <React.Fragment>
                  <Button variant='outlined' fullWidth sx={{textTransform:'none',}} startIcon={(<img alt="google" src={Images.GOOGLE} width={20} height={20} />)} onClick={loginWithGmail}>
                    Login dengan akun google
                  </Button>
                  <div style={{margin:6}}>atau</div>
                  <TextField
                    size='small' 
                    label="Nomor Handphone" 
                    fullWidth 
                    value={hp}
                    inputMode='numeric'
                    onChange={setNumber}
                    InputProps={{
                      startAdornment:'+62',
                      endAdornment:(
                        <IconButton sx={{marginRight:-1}} disabled={hp.length < 10} onClick={loginWithPhone}>
                          <SendRounded htmlColor={Colors.grey90} fontSize='small' />
                        </IconButton>)
                    }} 
                  />
                </React.Fragment>
            }
          </div>
          <div id="recaptcha-container"></div>
        </PopUp>

        <PopUp agreeText='Simpan &#38; Lanjutkan' noNext noCancel open={pop === 'profil'} title="Lengkapi Profil" disagreeText="Batal" >
          <LengkapiData counterClose={()=>setPop('')} user={userData} counterSuccess={updateUser} />
        </PopUp>
      </Main>
    </Box>
  );
}

PageBase.propTypes = {
  activePage: PropTypes.string,
  classes: PropTypes.object,
  children: PropTypes.node,
  pageTitle: PropTypes.string,
};

PageBase.defaultProps = {
  activePage: '',
  classes: {},
  children: null
};