/* eslint-disable react/prop-types */
import React, {Component, createRef, Fragment} from 'react';
import PropTypes from 'prop-types';
import { Alert, Avatar, Button, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Rating, Snackbar, Tab, Tabs } from '@mui/material';
import {AccessTimeRounded, ChevronLeftRounded, DeleteRounded, DownloadRounded, GroupsRounded, LocationOn, SellRounded, TouchAppRounded} from '@mui/icons-material';
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import { AdminList, Colors, Images } from '../../Configs';
import { firestore, fAuth, storage } from '../../Configs/firebase';
import { parseMoney, userLib } from '../../Helpers';
import { ChatSection } from '../../Elements';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import axios from 'axios';

export default class EventDetails extends Component{

  constructor(props){
    super(props);
    this.state = {
      activeTab:1,
      eventDetail:{},
      mentorInfo:{},
      disabledDiscuss: false,
      isMentor:false,
      snackBar:{severity:'', message:''},
      eventAlreadyEnded: false,
    };

    this.materialRef = createRef(null);
    this.transferRef = createRef(null);
  }

  componentDidMount(){
    this._getEventDetail();
  }

  handleCloseAlert = () => {
    this.setState({snackBar:{severity:'', message:''}});
  }

  _getEventDetail = async () => {
    const {match} = this.props;
    if(match.params.eventId){
      const eventId = match.params.eventId;
      onSnapshot(doc(firestore, 'events', eventId), async (snap)=>{
        if(!snap.exists()){
          alert('Sepertinya event telah dihapus');
          this.props.history.replace('/');
          return;
        }
        const eventDetail = snap.data();

        const joined = eventDetail.joined || [];
        const started = new Date(eventDetail.eventStarted.seconds * 1000);
        const ended = new Date(eventDetail.eventEnded.seconds * 1000);

        const eventAlreadyStarted = started < new Date();
        const eventAlreadyEnded = ended < new Date();
        const isMentor = fAuth.currentUser?.uid === eventDetail.uid;
        const joinedEvent = joined.includes(fAuth.currentUser?.uid);

        if(!joinedEvent && eventAlreadyStarted && !isMentor){
          this.props.history.replace('/');
        }
  
        const setDiscuss = () => {
          if(!eventDetail.eventDiscuss){
            this.setState({
              disabledDiscuss:true,
              activeTab:0
            });
          }
        };

        this.setState({eventDetail, isMentor, eventAlreadyEnded}, setDiscuss());

        const mentorId = snap.data().uid;
        const userRef = doc(firestore, `users/${mentorId}`);
        const userSnap = await getDoc(userRef);
        if(userSnap.exists()){
          const userSnapData = userSnap.data();
          const fileRef = ref(storage, `profile-picutre/${mentorId}`);
          await getDownloadURL(fileRef)
            .then(url=>{
              userSnapData.photoUrl = url;
            }).catch((err)=>{
              console.log(err);
            });
          
          this.setState({mentorInfo: userSnapData});
        }
      });
    }else this.props.history.replace('/');
  }

  _handleUploadMaterial = () => {
    this.materialRef.current.click();
  }

  _handleUploadTransfer = () => {
    this.transferRef.current.click();
  }

  onUploadMaterial = async ( e ) => {
    const file = e.target.files[0];
    if(file){
      const {match} = this.props;
      const eventId = match.params.eventId;
  
      const fileSize = file.size;
      if(fileSize > (1000 * 5000)){
        this.setState({snackBar:{message: 'Maaf, ukuran maksimal file adalah 5MB', severity:'error'}});
        return;
      }
  
      this.setState({snackBar:{message: 'Mengunggah file...', severity:'success'}});
      const fileId = Date.now();
      const fileRef = ref(storage, `materials/${fileId}`);
      await uploadBytes(fileRef, file)
        .then(async()=>{
          await getDownloadURL(fileRef)
            .then(async fileUrl=>{
              const currentMaterials = this.state.eventDetail.materials || [];
              await updateDoc(doc(firestore, `events/${eventId}`), {
                materials: [...currentMaterials, {
                  fileUrl,
                  fileId,
                  fileName:file.name
                }],
                updatedAt: Date.now(),
              }).then(()=>{
                this.setState({snackBar:{message: 'Berhasil mengunggah file', severity:'success'}});
              }).catch((err)=>{
                this.setState({snackBar:{message: err.message, severity:'error'}});
              });
            }).catch((err)=>{
              this.setState({snackBar:{message: err.message, severity:'error'}});
            });
        })
        .catch((err)=>{
          this.setState({snackBar:{message: err.message, severity:'error'}});
        });
    }
  }

  onUploadTransfer = async ( e ) => {
    const file = e.target.files[0];
    if(file){
      const {match} = this.props;
      const eventId = match.params.eventId;
  
      const fileSize = file.size;
      if(fileSize > (1000 * 5000)){
        this.setState({snackBar:{message: 'Maaf, ukuran maksimal file adalah 5MB', severity:'error'}});
        return;
      }
  
      this.setState({snackBar:{message: 'Mengunggah file...', severity:'success'}});
      const fileId = Date.now();
      const fileRef = ref(storage, `transfers/${fileId}`);
      await uploadBytes(fileRef, file)
        .then(async()=>{
          await getDownloadURL(fileRef)
            .then(async fileUrl=>{
              await updateDoc(doc(firestore, `events/${eventId}`), {
                transferUrl: fileUrl,
                updatedAt: Date.now(),
              }).then(()=>{
                this.setState({snackBar:{message: 'Berhasil mengunggah file', severity:'success'}});
              }).catch((err)=>{
                this.setState({snackBar:{message: err.message, severity:'error'}});
              });
            }).catch((err)=>{
              this.setState({snackBar:{message: err.message, severity:'error'}});
            });
        })
        .catch((err)=>{
          this.setState({snackBar:{message: err.message, severity:'error'}});
        });
    }
  }

  _handleDeleteMaterial = (id) => () =>{
    const currentMaterials = this.state.eventDetail.materials || [];
    const newMaterials = currentMaterials.filter(material=> material.fileId !== id);
    const {match} = this.props;
    const eventId = match.params.eventId;
    updateDoc(doc(firestore, `events/${eventId}`), {
      materials: newMaterials,
      updatedAt: Date.now(),
    }).then(()=>{
      this.setState({snackBar:{message: 'Berhasil menghapus file', severity:'success'}});
    }).catch((err)=>{
      this.setState({snackBar:{message: err.message, severity:'error'}});
    });
  }

  _handleChangeTab = (e, activeTab) => {
    this.setState({activeTab});
  };

  _handlePayAndGet = () =>{
    const {eventDetail} = this.state;
    const {history} = this.props;
    if(!eventDetail.eventPrice){
      const currentJoin = eventDetail.joined || [];
      updateDoc(doc(firestore, `events/${eventDetail.eventId}`), {
        joined: [...currentJoin, fAuth.currentUser?.uid]
      }).then(()=>{
        this.setState({snackBar:{message: 'Selamat Anda telah bergabung ke dalam event.', severity:'success'}});
      }).catch(err=>{
        this.setState({snackBar:{message: err.message, severity:'error'}});
      });
    }else{
      const body = {
        transaction_details: {
          order_id: 'p4m-order-' + Date.now(),
          gross_amount: eventDetail.eventPrice
        },
        credit_card: {
          secure: true
        },
        item_details: [{
          id: eventDetail.eventId,
          price: eventDetail.eventPrice,
          quantity: 1,
          name: eventDetail.eventTitle,
          brand: 'Midtrans',
          category: 'Online Course',
          merchant_name: 'P4M'
        }],
        customer_details:{
          first_name:userLib.data.fullName,
          last_name: '',
          email: userLib.data.email || fAuth.currentUser?.email,
        },
        custom_field1: fAuth.currentUser?.uid,
        custom_field2: eventDetail.eventId,
      };
      
  
      axios.post('https://p4m-api.vercel.app/api/make-payment', body)
        .then(async res=>{
          // console.log(res.data);
          const paymentSnap = await getDoc(doc(firestore, `users/${fAuth.currentUser?.uid}/payment/${eventDetail.eventId}`));
          const method = paymentSnap.exists() ? updateDoc : setDoc;
          await method(doc(firestore, `users/${fAuth.currentUser?.uid}/payment/${eventDetail.eventId}`), {
            token: res.data.token
          });
          await window.snap.pay(res.data.token, {
            // Optional
            onSuccess: function(){
              history.replace('/pembayaran');
            },
            // Optional
            onPending: function(){
              history.replace('/pembayaran');
            },
            // Optional
            onError: function(){
              console.log('0i');
            }
          });
        })
        .catch(err=>{
          console.log(err);
        });
    }
  }

  _handleGoBack = () => {
    this.props.history.goBack();
  }

  _renderClass = () => {
    const {eventDetail} = this.state;
    switch (eventDetail?.eventClass){
    case 1 : return 'VVIP';
    case 5 : return 'VIP';
    case 10 : return 'Reguler';
    default: return null;
    }
  }

  _handleGoToMeet = () => {
    const { eventDetail } = this.state;
    if(eventDetail?.uid === fAuth.currentUser?.uid)
      this.props.history.push(`/area-mentor/${eventDetail.eventId}/meet`, eventDetail);
    else this.props.history.push(`/event/${eventDetail.eventId}/meet`, eventDetail);
  }

  _canGoMeet = () => {
    const { eventDetail } = this.state;
    const joined = eventDetail.joined || [];
    if(eventDetail?.uid === fAuth.currentUser?.uid || joined.includes(fAuth.currentUser?.uid)){
      return true;
    }

    return false;
  }

  _needJoin = () => {
    const { eventDetail } = this.state;
    const joined = eventDetail.joined || [];
    const hasStocks = joined.length < eventDetail.eventClass;
    if(eventDetail?.uid !== fAuth.currentUser?.uid && !joined.includes(fAuth.currentUser?.uid) && hasStocks){
      return true;
    }

    return false;
  }

  render(){
    const {classes} = this.props;
    const {eventDetail, mentorInfo, disabledDiscuss} = this.state;
    const {activeTab, isMentor, eventAlreadyEnded} = this.state;
    return(
      <Fragment>
        <Grid container spacing={2}>
          <Grid item md={8} xs={12}>
            <Paper className={classes.paperBar}>
              <div>
                <div style={{display:'flex', alignItems:'center'}}>
                  <IconButton onClick={this._handleGoBack}>
                    <ChevronLeftRounded htmlColor={Colors.black} fontSize='medium' />
                  </IconButton>
                  <h1 style={{fontSize:14}}>{eventDetail?.eventTitle}</h1>
                </div>
                <Grid container spacing={2} style={{padding:'10px 20px 20px'}}>
                  <Grid item lg={5} xs={12}>
                    <img 
                      alt='cover' 
                      loading="eager"
                      src={eventDetail?.eventCover}
                      style={{
                        objectFit:'contain', 
                        width: '100%', 
                        borderRadius:8,
                        alignSelf:'flex-start',
                      }} 
                    />
                    <div style={{display:'flex', gap:4, alignItems:'center', marginBottom:4, color: Colors.info}}>
                      {/* <AccessTimeRounded style={{fontSize:18}} /> */}
                      <span style={{fontSize:12}}>Mulai: {moment(eventDetail?.eventStarted?.seconds * 1000).format('dddd, Do MMMM YYYY')}</span>
                    </div>
                    <div style={{display:'flex', gap:4, alignItems:'center', marginBottom:4, color: Colors.info}}>
                      {/* <AccessTimeRounded style={{fontSize:18}} /> */}
                      <span style={{fontSize:12}}>Berakhir: {moment(eventDetail?.eventEnded?.seconds * 1000).format('dddd, Do MMMM YYYY')}</span>
                    </div>
                    <div style={{display:'flex', gap:4, alignItems:'center', marginBottom:4, color: Colors.info}}>
                      <AccessTimeRounded style={{fontSize:18}} />
                      <span style={{fontSize:12}}>{moment(eventDetail?.time?.seconds * 1000).format('LT')}</span>
                    </div>
                    <div style={{display:'flex', gap:4, alignItems:'center', marginBottom:4}}>
                      <SellRounded style={{fontSize:18}} />
                      <span style={{fontSize:14, fontWeight:'bold'}}>{eventDetail?.eventPrice ? `Rp ${parseMoney(eventDetail?.eventPrice)}` : 'Gratis'}</span>
                    </div>
                    <div style={{display:'flex', gap:4, alignItems:'center', marginTop:8, color:Colors.grey80}}>
                      <GroupsRounded style={{fontSize:18}} />
                      <span style={{fontSize:12}}>Maksimal {eventDetail?.eventClass} peserta <strong>({this._renderClass()})</strong></span>
                    </div>
                    <div style={{display:'flex', gap:4, alignItems:'center', color:Colors.grey80}}>
                      <TouchAppRounded style={{fontSize:18}} />
                      <span style={{fontSize:12}}>{eventDetail?.joined?.length || '0'} orang telah bergabung</span>
                    </div>
                    {eventDetail?.eventLocation &&
                      <div style={{display:'flex', gap:4, alignItems:'center', color:Colors.grey80}}>
                        <LocationOn style={{fontSize:18}} />
                        <span style={{fontSize:12}}>{eventDetail?.eventLocation}</span>
                      </div>
                    }
                    {fAuth.currentUser?.uid &&
                    <>
                      {this._canGoMeet() &&
                      <Button 
                        size='small' 
                        fullWidth 
                        variant='contained' 
                        sx={{
                          background: Colors.primary,
                          textTransform:'none',
                          '&:hover':{
                            background: Colors.primary_light,
                          },
                          mt:2
                        }}
                        onClick={this._handleGoToMeet}
                      >
                        Link Meet
                      </Button>
                      }
                      {this._needJoin() &&
                      <Button 
                        size='small' 
                        fullWidth 
                        variant='contained' 
                        sx={{
                          background: Colors.primary,
                          textTransform:'none',
                          '&:hover':{
                            background: Colors.primary_light,
                          },
                          mt:2
                        }}
                        onClick={this._handlePayAndGet}
                      >
                        Bergabung
                      </Button>
                      }
                    </>}
                  </Grid>
                  <Grid item lg={7} xs={12}>
                    <div style={{maxHeight:'70vh', overflow:'auto'}}>
                      <Tabs 
                        value={activeTab}
                        onChange={this._handleChangeTab} 
                        TabIndicatorProps={{
                          sx: {
                            backgroundColor: Colors.primary,
                          },
                        }}
                        className={classes.tabs}>
                        <Tab value={0} className="tab" label="Detail Kegiatan" />
                        <Tab value={1} className="tab" label="Diskusi" disabled={disabledDiscuss} />
                      </Tabs>
                      <div style={{marginTop:10}}>
                        {activeTab === 0 &&
                          <div style={{fontSize:12}}>
                            <div>Kategori: {eventDetail?.eventCategories?.join(', ')}</div>
                            <br/>
                            {eventDetail?.eventDetail || '-'}
                          </div>
                        }
                        <ChatSection show={activeTab === 1} eventId={eventDetail.eventId} />
                        
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Paper>
          </Grid>
          <Grid item md={4} xs={12}>
            <Paper className={classes.paperBar} sx={{mb:2, display: this._canGoMeet() ? 'block' :'none'}}>
              <div style={{padding:'0 20px 10px'}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                  <h2 style={{fontSize:14}}>Materi Tersedia</h2>
                  {isMentor &&
                    <Button 
                      size='small' 
                      variant='contained' 
                      sx={{
                        background: Colors.primary,
                        textTransform:'none',
                        '&:hover':{
                          background: Colors.primary_light,
                        },
                      }}
                      onClick={this._handleUploadMaterial}
                    >
                      Unggah Materi
                    </Button>
                  }
                  <input onChange={this.onUploadMaterial} ref={this.materialRef} type='file' hidden />
                </div>
                {eventDetail.materials?.length ?
                  <List dense sx={{marginLeft:-2}}>
                    {eventDetail.materials.map(material=>(
                      <ListItem
                        key={material.fileId}
                        secondaryAction={
                          <a href={material.fileUrl} download={material.fileName} target='_blank' rel="noreferrer">
                            <DownloadRounded sx={{color:Colors.grey80}} />
                          </a>
                        }
                      >
                        {isMentor &&
                        <ListItemAvatar>
                          <IconButton onClick={this._handleDeleteMaterial(material.fileId)}>
                            <DeleteRounded />
                          </IconButton>
                        </ListItemAvatar>
                        }
                        <ListItemText primary={material.fileName} />
                      </ListItem>
                    ))}
                  </List>
                  :
                  <div className='no-data'>
                    <img src={Images.NO_DATA} />
                    <div className='text-no-data'>Belum ada materi</div>
                  </div>
                }
                
              </div>
            </Paper>
            
            <Paper className={classes.paperBar} sx={{mb:2}}>
              <div style={{padding:'0 20px 10px'}}>
                <h2 style={{fontSize:14}}>Tentang Mentor</h2>
                <div style={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
                  <Avatar sx={{backgroundColor:Colors.info_light, color:Colors.info, fontWeight:'bold'}} src={mentorInfo.photoUrl} ></Avatar>
                      
                  <div style={{marginTop:2, textAlign:'center'}} >
                    <div style={{color:Colors.black, fontWeight:400, fontSize:14}} >{mentorInfo.fullName}</div>
                    <div style={{color:Colors.grey60, fontSize:12, marginTop:-5}} >{mentorInfo.university}</div>
                    {mentorInfo.status &&
                    <div style={{color:Colors.grey60, fontSize:12, marginTop:-5}} >({mentorInfo.status})</div>
                    }
                  </div> 
                </div>

                <div style={{marginTop:4, textAlign:'center'}}>
                  <Rating value={4.5} size="small" readOnly />
                </div>

                <div style={{fontSize:12, fontWeight:'bold'}}>Deskripsi</div>
                <div style={{fontSize:12, color:Colors.grey70, maxHeight:'52vh', overflow:'auto'}}>
                  {mentorInfo.desc}
                </div>
              </div>
            </Paper>

            {((AdminList.includes(fAuth.currentUser?.uid) || isMentor) && eventAlreadyEnded) &&
            <Paper className={classes.paperBar} sx={{mb:2, display: this._canGoMeet() ? 'block' :'none'}}>
              <div style={{padding:'0 20px 10px'}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                  <h2 style={{fontSize:14}}>Bukti Transfer</h2>
                  <Button 
                    size='small' 
                    variant='contained' 
                    sx={{
                      background: Colors.primary,
                      textTransform:'none',
                      '&:hover':{
                        background: Colors.primary_light,
                      },
                    }}
                    onClick={this._handleUploadTransfer}
                  >
                      Unggah
                  </Button>
                
                  <input onChange={this.onUploadTransfer} ref={this.transferRef} type='file' hidden />
                </div>
                {eventDetail.transferUrl &&
                  <div>
                    <img src={eventDetail.transferUrl} style={{width:'100%', marginTop:10}} />
                  </div>
                }
                
              </div>
            </Paper>
            }

          </Grid>
        </Grid>
        <Snackbar open={Boolean(this.state.snackBar.message)} onClose={this.handleCloseAlert} anchorOrigin={{ vertical:'top', horizontal:'center' }}>
          <Alert onClose={this.handleCloseAlert} severity={this.state.snackBar.severity} sx={{ width: '100%' }}>
            {this.state.snackBar.message}
          </Alert>
        </Snackbar>
      </Fragment>
    );
  }
}

EventDetails.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
  mediaQuery: PropTypes.bool
};
  
EventDetails.defaultProps = {
  classes: {},
  children: null
};