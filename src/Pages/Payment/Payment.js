import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Paper, Box, Grid, Button, Chip } from '@mui/material';
import { firestore, fAuth } from '../../Configs/firebase';
import { Colors } from '../../Configs';
import moment from 'moment';
// import { parseMoney } from '../../Helpers';

export default class Payment extends Component{

  state = {
    payments:[]
  }

  componentDidMount(){
    this._handleGetMyPayment();
  }

  _handleGetMyPayment = () => {
    const q = query(collection(firestore, `users/${fAuth.currentUser?.uid}/payment`));
    onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot?.forEach((doc) => {
        const docData = doc.data();
        data.push({...docData, eventId: doc.id});
      });
      console.log(data);
      this.setState({payments: data});
    }, (err)=> console.log(err));
  }

  _handleToDetail = (idEvent) => () => {
    this.props.history.push(`/beranda/${idEvent}`);
  }

  _renderStatus = (payment) => {
    if(payment.transaction_status === 'pending')
      return(
        <Chip variant='outlined' label='Menunggu Pembayaran' size="small" color='warning' />
      );
    else if(payment.transaction_status === 'settlement')
      return(
        <Chip variant='outlined' label='Pembayaran Berhasil' size="small" color='success' />
      );
    else if(payment.transaction_status === 'expire')
      return(
        <Chip variant='outlined' label='Kadaluarsa' size="small" color='error' />
      );
    else
      return(
        <Chip variant='outlined' label={payment.transaction_status} size="small" color='error' />
      );
  }

  _renderInfo = (token) => () => {
    if(token)
      window.snap.pay(token, {
        // Optional
        onSuccess: function(){
          // history.replace('/pembayaran');
        },
        // Optional
        onPending: function(){
          // history.replace('/pembayaran');
        },
        // Optional
        onError: function(){
          console.log('0i');
        }
      });
  }

  render(){
    const {payments} = this.state;
    const {classes} = this.props;
    return(
      <Fragment>
        <Box
          sx={{
            '& > :not(style)': {
              m: 2,
              p: 3
            },
          }}
          className={classes.root}
        >
          {payments.map(payment=> payment.transaction_id && (
            <Paper elevation={0} key={payment.transaction_id} sx={{position:'relative'}}>
              <div style={{position:'absolute', top:-12, left:8}}>
                {this._renderStatus(payment)}
              </div>
              <Grid container spacing={1} alignItems="center" justifyContent='space-between'>
                <Grid item lg={2} xs={12} md={6}>
                  <div className='card-info'>Kode Pembayaran</div>
                  <div className='card-value'>{payment.payment_code || '-'}</div>
                </Grid>
                <Grid item lg={2} xs={12} md={6}>
                  <div className='card-info'>Metode Pembayaran</div>
                  <div className='card-value'>{payment.store || payment.payment_type} (Midtrans)</div>
                </Grid>
                <Grid item lg={2} xs={12} md={6}>
                  <div className='card-info'>Jumlah Pembayaran</div>
                  <div className='card-value'>{payment.currency} {payment.gross_amount}</div>
                </Grid>
                <Grid item lg={3} xs={12} md={6}>
                  <div className='card-info'>Batas Akhir Pembayaran</div>
                  <div className='card-value'>{moment(new Date(payment.transaction_time).getTime() + (24*60*60*1000)).format('LT, dddd, Do MMMM YYYY')}</div>
                </Grid>
                <Grid item lg={3} xs={12} md={6} sx={{display:'flex', justifyContent:'flex-end'}}>
                  {/* <Button size="small" sx={{textTransform:'none', mr:1}} variant='outlined'>Cara Pembayaran</Button> */}
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
                    onClick={this._handleToDetail(payment.custom_field2)}
                  >
                        Detail Event
                  </Button>
                  <Button 
                    size='small'
                    variant='outlined' 
                    onClick={this._renderInfo(payment.token)}
                    sx={{ml:1}}
                  >
                        Instruksi
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>
      </Fragment>
    );
  }
}

Payment.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
  mediaQuery: PropTypes.bool,
  history:PropTypes.object,
};
  
Payment.defaultProps = {
  classes: {},
  children: null,
  history:{}
};