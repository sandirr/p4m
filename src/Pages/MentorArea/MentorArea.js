/* eslint-disable no-unused-vars */
import React, {Component, createRef} from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Paper, Tab, Tabs, TextField, Typography, IconButton, LinearProgress, linearProgressClasses, Badge, Button, Autocomplete, Chip, Box, MenuItem, FormControlLabel, Switch, Snackbar, Alert } from '@mui/material';
import { AccessTimeRounded, GroupsRounded, FilterListRounded } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { SearchRounded, Delete, ImageRounded, AddAPhotoRounded } from '@mui/icons-material';
import { LocalizationProvider, MobileDateRangePicker, TimePicker } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { Colors, Science, fAuth } from '../../Configs';
import { Fragment } from 'react';
import {PopUp} from '../../Elements';
import { parseMoney } from '../../Helpers';
import {storage} from '../../Configs/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default class Home extends Component{

  constructor(props){
    super(props);
    this.state = {
      activeTab:0,
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
      },

      snackBar:{},
      error:{
        rangeDate:[false, false],
      },
    };

    this._uniqueId = Date.now();
    this.coverRef = createRef(null);
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.fields !== this.state.fields){
      this.checkFieldsError;
    }
  }

  checkFieldsError = () => {
    const {eventTitle, eventCategories, eventClass, eventCover, rangeDate, time} = this.state.fields; 
    this.setState({
      error:{
        rangeDate:[!rangeDate[0], !rangeDate[1]],
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

  handleSelectCover = () => {
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
    this.setState({activeTab});
  };

  _handleToDetail = (id) => () => {
    this.props.history.push(`/beranda/${id}`);
  }

  _handleOpenDrawer = (drawer) => () => {
    this.setState({drawer});
  }

  _handleCloseDrawer = () => {
    this.setState({drawer:''});
  }

  onFilechange = async ( e ) => {
    /*Selected files data can be collected here.*/
    const file = e.target.files[0];

    const acceptedExt = ['png', 'jpg', 'jpeg', 'gif'];
    const fileExt = file.name.split('.').reverse()[0];
    
    if(!acceptedExt.includes(fileExt?.toLowerCase())){
      this.setState({snackBar:{message: 'Maaf, Anda hanya diperbolehkan mengunggah file gambar', severity:'error'}});
      return;
    }

    const fileSize = file.size;
    if(fileSize > (1000 * 1000)){
      this.setState({snackBar:{message: 'Maaf, ukuran maksimal file adalah 1MB', severity:'error'}});
      return;
    }

    this.setState({snackBar:{message: 'Mengunggah gambar...', severity:'success'}});
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

  handleCloseAlert = () => {
    this.setState({snackBar:{severity:'', message:''}});
  }

  render(){
    const {activeTab, drawer, fields, error} = this.state;
    const {eventTitle, eventCategories, eventPrice, eventClass, eventDetail, eventDiscuss, eventCover, rangeDate, time} = fields;
    const {classes} = this.props;
    return(
      <Fragment>
        <Grid container spacing={2} alignItems="center" className={classes.root} >
          <Grid item xs={12} md={9}>
            <Paper className={classes.paperBar} >
              <Tabs 
                value={activeTab} 
                indicatorColor={null}
                onChange={this._handleChangeTab} 
                className={classes.tabs}
                variant="scrollable"
                scrollButtons="auto">
                <Tab className="tab" label="Semua" />
                <Tab className="tab" label="Event Aktif" />
                <Tab className="tab" label="Event Selesai" />
                <Tab className="tab" label="Draft" />
              </Tabs>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3} alignItems='flex-end' justifyContent='flex-end'>
            <Button fullWidth className='create-btn' onClick={this._handleOpenDrawer('Buat Event')} >+ Buat Event</Button>
          </Grid>
          {[1,2].map(e=>(
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

        <PopUp title={drawer} maxWidth='md' backdropClose={false} handleClose={this._handleCloseDrawer} open={Boolean(drawer)} agreeText="Publish" ndButton='Draft'>
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
              <div style={{textAlign:'center', fontSize:14}}>Rekomendasi rasio gambar 3:2</div>
              <div style={{textAlign:'center', marginTop:10}}>
                <IconButton onClick={this.handleSelectCover}><AddAPhotoRounded/></IconButton>
                <IconButton onClick={this.handleDeleteCover}><Delete/></IconButton>
              </div>
            </Grid>
            <Grid item md={7} xs={12}>
              <input hidden type="file" ref={this.coverRef} onChange={this.onFilechange} />
              <TextField error={error.eventTitle} name='eventTitle' onChange={this._handleChangeField} value={eventTitle} label="Judul Event" placeholder="Workshop Design Thinking" sx={{mt:1}} size='small' fullWidth InputLabelProps={{shrink: true }} />
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
                    error={error.eventCategories}
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
                      <TextField error={error.rangeDate[0]} InputLabelProps={{shrink: true }} fullWidth size="small" {...startProps} />
                      <Box sx={{ mx: 1 }}> - </Box>
                      <TextField error={error.rangeDate[1]} InputLabelProps={{shrink: true }} fullWidth size="small" {...endProps} />
                    </React.Fragment>
                  )}
                />
                <TimePicker
                  label="Waktu"
                  value={time}
                  onChange={(newValue) => {
                    this.setState({fields: {...this.state.fields, time:newValue}});
                  }}
                  renderInput={(params) => <TextField error={error.time} placeholder='Jam:Menit' helperText={(<span>AM: 00.00 Malam - 11.59 Siang<br/>PM: 12.00 Siang - 11.59 Malam</span>)} sx={{mt:2}} InputLabelProps={{shrink: true }} fullWidth size="small" {...params} />}
                />
              </LocalizationProvider>

              <TextField error={error.eventClass} label="Kelas Event" name="eventClass" onChange={this._handleChangeField} value={eventClass} sx={{mt:2}} size='small' fullWidth InputLabelProps={{shrink: true }} select >
                <MenuItem value={100}>Reguler (max. 100 orang)</MenuItem>
                <MenuItem value={5}>VIP (private max. 5 orang)</MenuItem>
                <MenuItem value={1}>VVIP (private 1 orang)</MenuItem>
              </TextField>

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
        <Snackbar open={Boolean(this.state.snackBar.message)} onClose={this.handleCloseAlert} anchorOrigin={{ vertical:'top', horizontal:'center' }}>
          <Alert onClose={this.handleCloseAlert} severity={this.state.snackBar.severity} sx={{ width: '100%' }}>
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