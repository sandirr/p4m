import React, {Component, Fragment, createRef} from 'react';
import PropTypes from 'prop-types';
import { Button, TextField } from '@mui/material';
import { LocalizationProvider, MobileDatePicker } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { Colors, fAuth } from '../../Configs';
import { signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { firestore, storage } from '../../Configs/firebase';
import { Person } from '@mui/icons-material';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default class LengkapiData extends Component{

  constructor(props){
    super(props);
    this.state= {
      fields:{
        fullName:'',
        university:'',
        photoUrl:'',
        birthPlace:'',
        birthDate:null,
        status:'',
        desc:'',
        domicile:'',
      },
    };

    this.photoRef = createRef(null);
  }

  componentDidUpdate(){
    if(this.props.user && !this.state.fields.fullName && this.props.user !== this.state.fields){
      this.setState({
        fields: this.props.user
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

    const fileRef = ref(storage, `profile-picutre/${fAuth.currentUser.uid}`);
    await uploadBytes(fileRef, file)
      .then(async()=>{
        await getDownloadURL(fileRef)
          .then(url=>{
            this.setState({fields: {...this.state.fields, photoUrl: url}});
          }).catch((err)=>{
            alert(err.message);
          });
      })
      .catch((err)=>{
        alert(err.message);
      });
  }

  handleLogout = () => {
    signOut(fAuth).then(()=>{
      console.log('success logout');
    }).catch(err=>{
      alert(err.message);
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
        alert(err.message);
      });
  }

  counterClose = () => {
    this.setState({fields:{}}, this.props.counterClose);
  }

  render(){
    const {user, classes} = this.props;
    const {fields} = this.state;
    return(
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
            label="Universitas/Instansi"
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