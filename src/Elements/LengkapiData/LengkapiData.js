/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {Component, Fragment, createRef} from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Snackbar, TextField } from '@mui/material';
import { LocalizationProvider, MobileDatePicker } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { Colors, fAuth } from '../../Configs';
import { signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { firestore, storage } from '../../Configs/firebase';
import { Person } from '@mui/icons-material';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { isEmptyObject } from '../../Helpers';

export default class LengkapiData extends Component{

  constructor(props){
    super(props);
    this.state= {
      fields:{},
      snackBar:{
        message:'',
        severity:''
      }
    };

    this.photoRef = createRef(null);
  }

  componentDidUpdate(){
    if(this.props.user && isEmptyObject(this.state.fields) && this.props.user !== this.state.fields){
      const userData = this.props.user;
      userData.photoUrl = this.props.user.photoUrl || fAuth.currentUser.photoURL;
      if(this.props.user.birthDate){
        if(this.props.user.birthDate.seconds){
          userData.birthDate = new Date(this.props.user.birthDate.seconds * 1000);
        }
      }
      this.setState({
        fields: userData
      });
    }
  }

  handleChangeFields = ({target}) => {
    this.setState({fields: {...this.state.fields, [target.name]: target.value}});
  }

  handleChangeDate = (newVal) => {
    this.setState({fields: {...this.state.fields, birthDate: newVal}});
  }

  handleClickPhoto = () => {
    this.photoRef.current.click();
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
    const fileRef = ref(storage, `profile-picutre/${fAuth.currentUser.uid}`);
    await uploadBytes(fileRef, file)
      .then(async()=>{
        await getDownloadURL(fileRef)
          .then(url=>{
            this.setState({fields: {...this.state.fields, photoUrl: url}, snackBar:{message: 'Berhasil mengubah foto profil', severity:'success'}});
          }).catch((err)=>{
            this.setState({snackBar:{message: err.message, severity:'error'}});
          });
      })
      .catch((err)=>{
        this.setState({snackBar:{message: 'Gagal mengubah foto profil', severity:'error'}});
      });
  }

  handleLogout = () => {
    signOut(fAuth).then(()=>{
      console.log('success logout');
    }).catch(err=>{
      this.setState({snackBar:{message: err.message, severity:'error'}});
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const userRef = doc(firestore, `users/${fAuth.currentUser.uid}`);
    const body = {...this.state.fields};
    body.uid = fAuth.currentUser.uid;
    setDoc(userRef, body)
      .then(()=>{
        this.props.counterSuccess(body);
      })
      .catch(err=>{
        this.setState({snackBar:{message: err.message, severity:'error'}});
      });
  }

  counterClose = () => {
    this.setState({fields:{}}, this.props.counterClose);
  }

  handleCloseAlert = () => {
    this.setState({snackBar:{message:'', severity:''}});
  }

  render(){
    const {user, classes} = this.props;
    const {fields} = this.state;
    return(
      <Fragment>
        <form onSubmit={this.handleSubmit}>
          <div className={classes.root}>
            <input hidden type="file" ref={this.photoRef} onChange={this.onFilechange} />
            <div className='photo-container'>
              {fields?.photoUrl ?
                <img src={fields.photoUrl} style={{width:72, height:72}} />
                :
                <Person htmlColor='#555' style={{fontSize:72}} />
              }
              <div className='ganti-photo' onClick={this.handleClickPhoto}>Ganti Foto</div>
            </div>
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              label="Nama Lengkap"
              placeholder='Budi'
              size="small"
              value={fields.fullName}
              name='fullName'
              onChange={this.handleChangeFields}
              required
              fullWidth
            />
            <TextField 
              InputLabelProps={{
                shrink: true,
              }} 
              label="Status" 
              placeholder='Mahasiswa/Dosen/Profesional/dll.'
              size="small"
              value={fields.status}
              name='status'
              onChange={this.handleChangeFields}
              required
              fullWidth 
            />
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              label="Kampus/Lembaga/Organisasi"
              placeholder='UIN Alauddin Makassar / Tech Academy'
              size="small"
              value={fields.university}
              name='university'
              onChange={this.handleChangeFields}
              fullWidth
            />

            <TextField 
              InputLabelProps={{
                shrink: true,
              }} 
              label="Tempat Lahir" 
              placeholder='Makassar'
              size="small" 
              value={fields.birthPlace}
              name='birthPlace'
              onChange={this.handleChangeFields}
              fullWidth 
            />
            <Fragment>
              <LocalizationProvider dateAdapter={DateAdapter}>
                <MobileDatePicker
                  label="Tanggal lahir"
                  inputFormat="dd/MM/yyyy"
                  value={fields.birthDate}
                  onChange={this.handleChangeDate}
                  name='birthDate'
                  renderInput={(params) => <TextField fullWidth variant="outlined" size='small' InputLabelProps={{ shrink: true }} {...params} />}
                />
              </LocalizationProvider>
            </Fragment>
            <TextField 
              InputLabelProps={{
                shrink: true,
              }} 
              label="Alamat/Domisili" 
              placeholder='Bandung'
              size="small" 
              value={fields.domicile}
              name='domicile'
              onChange={this.handleChangeFields}
              fullWidth 
            />
            <TextField 
              InputLabelProps={{
                shrink: true,
              }} 
              label="Deskripsi" 
              placeholder='Mahasiswa UGM angkatan 2019 yang sangat meminati bidang AI dan AR.'
              type='date' 
              size="small" 
              value={fields.desc}
              name='desc'
              onChange={this.handleChangeFields}
              fullWidth 
              multiline 
              rows={3}
            />
          </div>
          <div style={{textAlign:'right', marginTop:20}}>
            <Button style={{color:Colors.primary, border:`1px solid ${Colors.primary}`, textTransform:'none', marginRight:12}} onClick={user ? this.counterClose : this.handleLogout}>{user ? 'Batal' : 'Logout'}</Button>
            <Button type="submit" style={{color:Colors.white, backgroundColor:Colors.primary, textTransform:'none', border:`1px solid ${Colors.primary}`}} >Simpan & Lanjutkan</Button>
          </div>
        </form>  
        <Snackbar open={Boolean(this.state.snackBar.message)} onClose={this.handleCloseAlert} anchorOrigin={{ vertical:'top', horizontal:'center' }}>
          <Alert onClose={this.handleCloseAlert} severity={this.state.snackBar.severity} sx={{ width: '100%' }}>
            {this.state.snackBar.message}
          </Alert>
        </Snackbar>
      </Fragment>
    );
  }
}

LengkapiData.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
  mediaQuery: PropTypes.bool,
  history:PropTypes.object,
  counterClose: PropTypes.func,
  counterSuccess: PropTypes.func,
  user: PropTypes.object,
};
  
LengkapiData.defaultProps = {
  classes: {},
  children: null,
  history:{}
};