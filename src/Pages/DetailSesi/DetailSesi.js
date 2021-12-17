/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {PageBase} from '../../Elements';
import PropTypes from 'prop-types';
import { Avatar, Button, Grid, IconButton, Paper, Rating, Tab, Tabs, TextField } from '@mui/material';
import {AccessTimeRounded, AttachmentRounded, ChevronLeftRounded, GroupsRounded, SellRounded, SendRounded, TouchAppRounded} from '@mui/icons-material';
import { Colors } from '../../Configs';

export default class DetailSesi extends Component{

  constructor(props){
    super(props);
    this.state = {
      activeTab:1
    };
  }

  _handleChangeTab = (e, activeTab) => {
    this.setState({activeTab});
  };

  _handlePayAndGet = () =>{
    window.snap.pay('8494cb21-eda5-4fff-8836-1a4294fba644');
  }

  render(){
    const {classes} = this.props;
    const {activeTab} = this.state;
    return(
      <PageBase pageTitle='Detail Sesi' activePage='Beranda' >
        <Grid container spacing={2}>
          <Grid item md={8} xs={12}>
            <Paper className={classes.paperBar}>
              <div>
                <div style={{display:'flex', alignItems:'center'}}>
                  <IconButton>
                    <ChevronLeftRounded htmlColor={Colors.black} fontSize='medium' />
                  </IconButton>
                  <h1 style={{fontSize:14}}>Workshop Pentingnya Belanja Kebutuhan Hidup</h1>
                </div>
                <Grid container spacing={2} style={{padding:'10px 20px 20px'}}>
                  <Grid item lg={5} xs={12}>
                    <img 
                      alt='cover' 
                      src='https://mui.com/static/images/cards/contemplative-reptile.jpg' 
                      style={{
                        objectFit:'contain', 
                        width: '100%', 
                        borderRadius:8,
                        alignSelf:'flex-start',
                      }} 
                    />
                    <div style={{display:'flex', gap:4, alignItems:'center', marginBottom:4, color: Colors.info}}>
                      <AccessTimeRounded style={{fontSize:18}} />
                      <span style={{fontSize:12}}>Kamis, 20 Agustus 2021</span>
                    </div>
                    <div style={{display:'flex', gap:4, alignItems:'center', marginBottom:4}}>
                      <SellRounded style={{fontSize:18}} />
                      <span style={{fontSize:14, fontWeight:'bold'}}>Rp200.000</span>
                    </div>
                    <div style={{display:'flex', gap:4, alignItems:'center', marginTop:8, color:Colors.grey80}}>
                      <GroupsRounded style={{fontSize:18}} />
                      <span style={{fontSize:12}}>Maksimal 100 peserta<strong> (Reguler)</strong></span>
                    </div>
                    <div style={{display:'flex', gap:4, alignItems:'center', color:Colors.grey80}}>
                      <TouchAppRounded style={{fontSize:18}} />
                      <span style={{fontSize:12}}>20 Orang telah bergabung</span>
                    </div>
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
                        <Tab className="tab" label="Detail Kegiatan" />
                        <Tab className="tab" label="Diskusi" />
                      </Tabs>
                      <div style={{marginTop:10}}>
                        {activeTab === 0 &&
                          <div style={{fontSize:12}}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry`s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                          </div>
                        }
                        {activeTab === 1 &&
                          <div className={classes.chatContainer}>
                            <div className='chats'>
                              <div className='left-chat'>
                                <div className='user'>Andi Irsandi R (Mentor)</div>
                                <div className='chat'>
                                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                </div>
                                <div className='chat-time'>2 jam yang lalu</div>
                              </div>
                              <div className='right-chat'>
                                <div className='user'>Sipaling tahu</div>
                                <div className='chat'>
                                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                </div>
                                <div className='chat-time'>2 jam yang lalu</div>
                              </div>
                            </div>
                            <div className='chat-footer'>
                              <IconButton>
                                <AttachmentRounded/>
                              </IconButton>
                              <TextField 
                                fullWidth
                                size='small'
                                autoCorrect={false}
                                className={classes.textareaChat}
                                inputProps={{
                                  style: {
                                    fontSize: 14,
                                    height: 10,
                                  }
                                }}
                              />
                              <IconButton>
                                <SendRounded/>
                              </IconButton>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Paper>
          </Grid>
          <Grid item md={4} xs={12}>
            <Paper className={classes.paperBar}>
              <div style={{padding:'0 20px 10px'}}>
                <h2 style={{fontSize:14}}>Tentang Mentor</h2>
                <div style={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
                  <Avatar sx={{backgroundColor:Colors.info_light, color:Colors.info, fontWeight:'bold'}} ></Avatar>
                      
                  <div style={{marginTop:2, textAlign:'center'}} >
                    <div style={{color:Colors.black, fontWeight:400, fontSize:14}} >Andi Irsandi R.</div>
                    <div style={{color:Colors.grey60, fontSize:12, marginTop:-5}} >UIN Alauddin Makassar</div>
                    <div style={{color:Colors.grey60, fontSize:12, marginTop:-5}} >(Mahasiswa)</div>
                  </div> 
                </div>

                <div style={{marginTop:4, textAlign:'center'}}>
                  <Rating value={3} size="small" />
                </div>

                <div style={{fontSize:12, fontWeight:'bold'}}>Deskripsi</div>
                <div style={{fontSize:12, color:Colors.grey70, maxHeight:'52vh', overflow:'auto'}}>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry`s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                </div>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </PageBase>
    );
  }
}

DetailSesi.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
  mediaQuery: PropTypes.bool
};
  
DetailSesi.defaultProps = {
  classes: {},
  children: null
};