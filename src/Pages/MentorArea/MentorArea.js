/* eslint-disable no-unused-vars */
import React, {Component, createRef} from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Paper, Tab, Tabs, TextField, Typography, IconButton, LinearProgress, linearProgressClasses, Badge, Button, Autocomplete, Chip, Box, MenuItem, FormControlLabel, Switch, Snackbar, Alert, CardActions } from '@mui/material';
import { AccessTimeRounded, GroupsRounded } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { Delete, ImageRounded, AddAPhotoRounded, Check } from '@mui/icons-material';
import { LocalizationProvider, MobileDateRangePicker, TimePicker } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { Colors, Science, fAuth } from '../../Configs';
import { Fragment } from 'react';
import {ConfirmationModal, PopUp} from '../../Elements';
import { allFalse, parseMoney, revParseMoney } from '../../Helpers';
import {firestore, storage} from '../../Configs/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collection, doc, onSnapshot, query, setDoc, where, orderBy, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import moment from 'moment';

export default class Home extends Component{

  constructor(props){
    super(props);
    this.state = {
      events:[],

      activeTab:'',
      drawer: '',

      fields:{
        rangeDate:[null,null],
        time:null,
        eventTitle:'',
        eventCategories:[],
        eventPrice:0,
        eventClass:'',
        eventDetail:'',
        eventDiscuss: true,
        eventCover:'',
        eventLocation:'',
      },

      snackBar:{},
      error:{
        rangeDate:true,
        time:true,
        eventTitle:true,
        eventCategories:true,
        eventClass:true,
        eventCover:true,
      },

      submitted:false,
      prepareToDelete: null,

      setBankAccount: false,
      bankAccount:{
        accountNumber:'',
        accountName:'',
        bankName:'',
      }
    };

    this._uniqueId = `p4m-${Date.now()}`;
    this.coverRef = createRef(null);
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.fields !== this.state.fields){
      this._checkFieldsError();
    }
  }

  componentDidMount(){
    this._getMyEvents();
    this._getBankAccount();
  }

  _handleToggleSetBankAcc = () => {
    this.setState({setBankAccount:!this.state.setBankAccount});
  }

  _handleChangeBankData = (e) => {
    this.setState({
      bankAccount:{
        ...this.state.bankAccount,
        [e.target.name]: e.target.value
      },
    });
  }

  _getMyEvents = () => {
    const {activeTab} = this.state;
    const now = new Date();
    let q = query(collection(firestore, 'events'), where('uid', '==', fAuth.currentUser?.uid), where('status', '==', 'publish'), orderBy('eventEnded', 'desc'));
    
    if(activeTab === 'active')
      q = query(collection(firestore, 'events'), where('uid', '==', fAuth.currentUser?.uid), where('status', '==', 'publish'), where('eventEnded', '>=', now), orderBy('eventEnded', 'desc'));
    else if(activeTab === 'done')
      q = query(collection(firestore, 'events'), where('uid', '==', fAuth.currentUser?.uid), where('status', '==', 'publish'), where('eventEnded', '<', now), orderBy('eventEnded', 'desc'));
    else if(activeTab === 'take_down')
      q = query(collection(firestore, 'events'), where('uid', '==', fAuth.currentUser?.uid), where('status', '==', 'take_down'));
    else
      q = query(collection(firestore, 'events'), where('uid', '==', fAuth.currentUser?.uid), where('status', '==', 'publish'), orderBy('eventEnded', 'desc'));

    onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({...doc.data(), eventId: doc.id});
      });
      this.setState({events: data});
    });
  }

  _getBankAccount = () => {
    onSnapshot(doc(firestore, `banks/${fAuth.currentUser?.uid}`), (bank)=> {
      if(bank.data()){
        const bankAccount = bank.data();
        this.setState({bankAccount});
      }
    });
  }

  _saveBankAccount = () => {
    setDoc(doc(firestore, `banks/${fAuth.currentUser?.uid}`), this.state.bankAccount)
      .then(()=>{
        this.setState({
          snackBar:{message: 'Sukses menyimpan data', severity:'success'},
          setBankAccount:false
        });
      })
      .catch(err=>{
        this.setState({
          snackBar:{message: err.message, severity:'error'}
        });
      });
  }

  _checkFieldsError = () => {
    const {eventTitle, eventCategories, eventClass, eventCover, rangeDate, time} = this.state.fields; 
    this.setState({
      error:{
        rangeDate:!rangeDate[0] || !rangeDate[1],
        time:!time,
        eventTitle:!eventTitle,
        eventCategories:!eventCategories?.length,
        eventClass:!eventClass,
        eventCover:!eventCover,
      }
    });
  }

  handleSelectCover = () => {
    this.coverRef.current.click();
  }

  handleDeleteCover = () => {
    this.setState({fields: {...this.state.fields, eventCover:''}});
  }

  _handleChangeField = (e) => {
    this.setState({fields: {...this.state.fields, [e.target.name]: e.target.value}});
  }

  _switchEventDiscuss = (e) => {
    this.setState({fields: {...this.state.fields, eventDiscuss: e.target.checked}});
  }

  _handleChangePrice = (e) => {
    const val = e.target.value;
    const thereIsNoNumber = val.replace(/[^0-9]/g, '');
    this.setState({fields: {...this.state.fields, eventPrice: parseMoney(thereIsNoNumber)}});
  }

  _handleChangeTab = (e, activeTab) => {
    this.setState({activeTab}, this._getMyEvents);
  };

  _handleToDetail = (id) => () => {
    this.props.history.push(`/area-mentor/${id}`);
  }

  _handleOpenDrawer = (drawer, event) => () => {
    if(event){
      this._uniqueId = event.eventId;
      this.setState({
        fields:{
          ...event,
          time: new Date(event.time.seconds * 1000),
          rangeDate: [new Date(event.rangeDate[0].seconds * 1000), new Date(event.rangeDate[1].seconds * 1000)]
        }
      });
    }else{
      this._uniqueId = `p4m-${Date.now()}`;
    }
    this.setState({drawer});
  }

  _handleCloseDrawer = () => {
    this.setState({
      drawer:'',
      fields:{
        rangeDate:[null,null],
        time:null,
        eventTitle:'',
        eventCategories:[],
        eventPrice:0,
        eventClass:'',
        eventDetail:'',
        eventDiscuss: true,
        eventCover:'',
        eventLocation:''
      },
      submitted: false
    });
  }

  _onFilechange = async ( e ) => {
    /*Selected files data can be collected here.*/
    const file = e.target.files[0];
    if(file){
      const acceptedExt = ['png', 'jpg', 'jpeg', 'gif'];
      const fileExt = file.name.split('.').reverse()[0];
      
      if(!acceptedExt.includes(fileExt?.toLowerCase())){
        this.setState({snackBar:{message: 'Maaf, Anda hanya diperbolehkan mengunggah file gambar', severity:'error'}});
        return;
      }
  
      const fileSize = file.size;
      if(fileSize > (1000 * 5000)){
        this.setState({snackBar:{message: 'Maaf, ukuran maksimal file adalah 5MB', severity:'error'}});
        return;
      }
  
      this.setState({snackBar:{message: 'Mengunggah gambar...', severity:'info'}});
      const fileRef = ref(storage, `cover-picutre/${this._uniqueId}`);
      await uploadBytes(fileRef, file)
        .then(async()=>{
          await getDownloadURL(fileRef)
            .then(url=>{
              this.setState({fields: {...this.state.fields, eventCover: url}, snackBar:{message: 'Berhasil mengunggah gambar', severity:'success'}});
            }).catch((err)=>{
              this.setState({snackBar:{message: err.message, severity:'error'}});
            });
        })
        .catch((err)=>{
          this.setState({snackBar:{message: 'Gagal mengunggah gambar', severity:'error'}});
        });
    }

  }

  _handleCloseAlert = () => {
    this.setState({snackBar:{severity:'', message:''}});
  }

  _submitData = (e) => {
    e.preventDefault();
    this.setState({submitted:true});
    if(allFalse(this.state.error)){
      const eventRef = doc(firestore, `events/${this._uniqueId}`);
      const body = {
        ...this.state.fields,
        uid: fAuth.currentUser.uid,
        eventId: this._uniqueId,
        status: 'publish',
        eventPrice: revParseMoney(this.state.fields.eventPrice),
        eventStarted: this.state.fields.rangeDate[0],
        eventEnded: this.state.fields.rangeDate[1],
        createdAt: this.state.fields.createdAt || Date.now(),
        updatedAt: Date.now(),
      };
      setDoc(eventRef, body)
        .then(()=>{
          this.setState({
            snackBar:{message: `Sukses ${this.state.drawer?.toLowerCase()}`, severity:'success'},
          }, this._handleCloseDrawer);
        })
        .catch(err=>{
          this.setState({snackBar:{message: err.message, severity:'error'}});
        });
    }
  }

  _handlePrepareToDelete = (id) => () => {
    this.setState({prepareToDelete:id});
  }

  _handleCancel = () => {
    updateDoc(doc(firestore, `events/${this.state.prepareToDelete}`), {status:'deleted'})
      .then(()=>{
        this.setState({
          snackBar:{message: 'Sukses menghapus event', severity:'success'},
          prepareToDelete:null
        });
      })
      .catch(err=>{
        this.setState({snackBar:{message: err.message, severity:'error'}, prepareToDelete:null});
      });
  }

  _renderActionByStatus = (event) => {
    const joined = event.joined?.length;
    const started = new Date(event.eventStarted.seconds * 1000);
    const eventAlreadyStarted = started < new Date();

    if (!joined && !eventAlreadyStarted){
      return(
        <Button size="small" sx={{textTransform:'none', color:Colors.primary}} onClick={this._handlePrepareToDelete(event.eventId)}>
          Batalkan
        </Button>
      );
    } else if(this.state.activeTab === 'done'){
      return(
        <div style={{fontSize:14}}>
          Penghasilan Rp {(event.eventPrice * joined) || 0}
        </div>
      );
    }

    return null;
  }

  render(){
    const {activeTab, drawer, fields, submitted, events, prepareToDelete, bankAccount, setBankAccount} = this.state;
    let error = {};
    if(submitted){
      error = this.state.error;
    }
    const {eventTitle, eventCategories, eventPrice, eventClass, eventDetail, eventDiscuss, eventCover, rangeDate, time, eventLocation} = fields;
    const {classes} = this.props;
    return(
      <Fragment>
        <Grid container spacing={2} alignItems="center" className={classes.root} >
          <Grid item xs={12} md={8}>
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
                <Tab className="tab" value="take_down" label="Take Down" />
                {/* <Tab className="tab" label="Draft" /> */}
              </Tabs>
            </Paper>
          </Grid>
          <Grid item xs={12} md={2} alignItems='flex-end' justifyContent='flex-end'>
            <Button fullWidth className='create-btn' onClick={this._handleOpenDrawer('Buat Event')} >+ Event</Button>
          </Grid>
          <Grid item xs={12} md={2} alignItems='flex-end' justifyContent='flex-end'>
            <Button fullWidth className='create-btn' onClick={this._handleToggleSetBankAcc} >Atur Rekening</Button>
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
                <CardActions>
                  {e.status !== 'take_down' &&
                  <Button size="small" color="primary" sx={{textTransform:'none'}} onClick={this._handleOpenDrawer('Edit Event', e)}>
                    Edit
                  </Button>
                  }
                  {this._renderActionByStatus(e)}
                  
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <ConfirmationModal open={Boolean(prepareToDelete)} title="Hapus Event" desc='Yakin ingin menghapus event? event yang sudah dihapus tidak dapat dipulihkan!' handleAgree={this._handleCancel} handleClose={this._handlePrepareToDelete(null)} agreeText='Hapus' />
        
        <PopUp title='Atur Rekening Bank' maxWidth='xs' backdropClose={false} handleClose={this._handleToggleSetBankAcc} open={setBankAccount} agreeText="Simpan" handleNext={this._saveBankAccount}>
          <TextField label="Nama pemilik rekening" name='accountName' onChange={this._handleChangeBankData} value={bankAccount.accountName} sx={{mt:2}} size='small' fullWidth />
          <TextField label="Nama bank" name='bankName' onChange={this._handleChangeBankData} value={bankAccount.bankName} sx={{mt:2}} size='small' fullWidth />
          <TextField label="Nomor rekening" name='accountNumber' onChange={this._handleChangeBankData} value={bankAccount.accountNumber} sx={{mt:2}} size='small' fullWidth />
        </PopUp>

        <PopUp title={drawer} maxWidth='md' backdropClose={false} handleClose={this._handleCloseDrawer} open={Boolean(drawer)} agreeText="Publish" handleNext={this._submitData}>
          <Grid container spacing={2}>
            <Grid item md={5} xs={12}>
              {eventCover ?
                <CardMedia
                  component="img"
                  height="180"
                  image={eventCover}
                  alt="cover"
                  style={{borderRadius:4}}
                />:
                <div style={{textAlign:'center'}}>
                  <ImageRounded style={{fontSize:240}} htmlColor={Colors.grey50} />
                </div>
              }
              {error.eventCover &&
              <div style={{color:Colors.primary, textAlign:'center', fontSize:12, marginTop:4}}>Mohon tambahkan poster/gambar</div>
              }
              <div style={{textAlign:'center', fontSize:14, marginTop:4}}>Rekomendasi rasio gambar 3:2</div>
              <div style={{textAlign:'center', marginTop:10}}>
                <IconButton onClick={this.handleSelectCover}><AddAPhotoRounded/></IconButton>
                <IconButton onClick={this.handleDeleteCover}><Delete/></IconButton>
              </div>
            </Grid>
            <Grid item md={7} xs={12}>
              <input hidden type="file" ref={this.coverRef} onChange={this._onFilechange} />
              <TextField helperText={error.eventTitle && <div style={{color:Colors.primary}}>Judul event wajib diisi</div>} name='eventTitle' onChange={this._handleChangeField} value={eventTitle} label="Judul Event" placeholder="Workshop Design Thinking" sx={{mt:1}} size='small' fullWidth InputLabelProps={{shrink: true }} />
              <Autocomplete
                multiple
                sx={{mt:2}}
                fullWidth
                options={Science.map((option) => option)}
                value={eventCategories}
                freeSolo
                onChange={(e, newVal)=>this.setState({fields: {...this.state.fields, eventCategories: newVal}})}
                size='small'
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" key={index} label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    helperText={error.eventCategories && <div style={{color:Colors.primary}}>Pilih setidaknya satu kategori dari pilihan tersedia agar event tampil pada halaman beranda</div>}
                    label="Kategori"
                    InputLabelProps={{shrink: true }}
                    placeholder="Misalnya: Informatika"
                  />
                )}
              />
              <TextField label="Harga Tiket" name='eventPrice' onChange={this._handleChangePrice} value={eventPrice} InputLabelProps={{shrink: true, inputMode:'decimal' }} placeholder='Gratis' sx={{my:2}} size='small' fullWidth InputProps={{startAdornment:'Rp '}} />

              <LocalizationProvider dateAdapter={DateAdapter}>
                <MobileDateRangePicker
                  startText="Mulai"
                  endText="Berakhir"
                  minDate={new Date()}
                  value={rangeDate}
                  onChange={(newValue) => {
                    this.setState({fields: {...this.state.fields, rangeDate:newValue}});
                  }}
                  renderInput={(startProps, endProps) => (
                    <React.Fragment>
                      <TextField helperText={error.rangeDate && <span style={{color:Colors.primary}}>Range tanggal wajib diisi</span>} InputLabelProps={{shrink: true }} fullWidth size="small" {...startProps} />
                      <Box sx={{ mx: 1 }}> - </Box>
                      <TextField InputLabelProps={{shrink: true }} fullWidth size="small" {...endProps} />
                    </React.Fragment>
                  )}
                />
                <TimePicker
                  label="Waktu"
                  value={time}
                  onChange={(newValue) => {
                    this.setState({fields: {...this.state.fields, time:newValue}});
                  }}
                  renderInput={(params) => 
                    <TextField 
                      placeholder='Jam:Menit' 
                      helperText={(
                        <div>
                          {error.time && <div style={{color:Colors.primary}}>Waktu event wajib diisi</div>}
                          <span>AM: 00.00 Malam - 11.59 Siang<br/>PM: 12.00 Siang - 11.59 Malam</span>
                        </div>)} 
                      sx={{mt:2}} 
                      InputLabelProps={{shrink: true }} 
                      fullWidth 
                      size="small" 
                      {...params} />}
                />
              </LocalizationProvider>

              <TextField helperText={error.eventClass && <div style={{color:Colors.primary}}>Kelas event wajib diisi</div>} label="Kelas Event" name="eventClass" onChange={this._handleChangeField} value={eventClass} sx={{mt:2}} size='small' fullWidth InputLabelProps={{shrink: true }} select >
                <MenuItem value={100}>Reguler (max. 100 orang)</MenuItem>
                <MenuItem value={5}>VIP (private max. 5 orang)</MenuItem>
                <MenuItem value={1}>VVIP (private 1 orang)</MenuItem>
              </TextField>

              <TextField label="Lokasi (Jika offline/hybrid)" name='eventLocation' onChange={this._handleChangeField} value={eventLocation} InputLabelProps={{shrink: true }} sx={{mt:2}} size='small' fullWidth />

              <TextField label="Detail Event" name='eventDetail' onChange={this._handleChangeField} value={eventDetail} sx={{mt:2}} fullWidth InputLabelProps={{shrink: true }} multiline rows={2} />

              <div style={{textAlign:'center'}}>
                <FormControlLabel
                  value="start"
                  control={<Switch color="primary" checked={eventDiscuss} onChange={this._switchEventDiscuss} />}
                  label="Buka Diskusi"
                  labelPlacement="start"
                />
              </div>

            </Grid>
          </Grid>
        </PopUp>
        <Snackbar open={Boolean(this.state.snackBar.message)} onClose={this._handleCloseAlert} anchorOrigin={{ vertical:'top', horizontal:'center' }}>
          <Alert onClose={this._handleCloseAlert} severity={this.state.snackBar.severity} sx={{ width: '100%' }}>
            {this.state.snackBar.message}
          </Alert>
        </Snackbar>
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