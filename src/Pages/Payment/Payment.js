import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Paper, Box, Grid, Button, Chip } from '@mui/material';
import { firestore, fAuth } from '../../Configs/firebase';
import { Colors } from '../../Configs';
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
          {payments.map(payment=>(
            <Paper elevation={0} key={payment.transaction_id} sx={{position:'relative'}}>
              <div style={{position:'absolute', top:-12, left:8}}>
                <Chip variant='outlined' label={payment.transaction_status === 'pending' ? 'Menunggu Pembayaran' : 'Pembayaran Berhasil'} size="small" color={payment.transaction_status === 'pending' ? 'warning' : 'success'} />
              </div>
              <Grid container spacing={1} alignItems="center">
                <Grid item lg={3} xs={12} md={6}>
                  <div className='card-info'>Kode Pembayaran</div>
                  <div className='card-value'>{payment.payment_code || '-'}</div>
                </Grid>
                <Grid item lg={3} xs={12} md={6}>
                  <div className='card-info'>Metode Pembayaran</div>
                  <div className='card-value'>{payment.store || payment.payment_type}</div>
                </Grid>
                <Grid item lg={3} xs={12} md={6}>
                  <div className='card-info'>Jumlah Pembayaran</div>
                  <div className='card-value'>{payment.currency} {payment.gross_amount}</div>
                </Grid>
                <Grid item lg={3} xs={12} md={6}>
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