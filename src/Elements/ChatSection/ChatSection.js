import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import { Alert, IconButton, Snackbar, TextField } from '@mui/material';
import { AttachmentRounded, SendRounded } from '@mui/icons-material';
import {ref, onValue, push} from 'firebase/database';
import { fAuth, fDB, Images, storage } from '../../Configs';
import { formattedDate, userLib } from '../../Helpers';
import { getDownloadURL, uploadBytes, ref as storageRef } from 'firebase/storage';

export default class ChatSection extends Component{

  constructor(props){
    super(props);
    this.state = {
      chats:[],
      message:'',

      loading:false,
      eventId:'',
      snackBar:{
        message:'',
        severity:''
      }
    };

    this.fileRef = createRef(null);
  }

  componentDidUpdate(){
    this._scrollToBottom();
    if(this.props.eventId && this.props.eventId !== this.state.eventId)
      this._handleGetChats();
  }

  handleCloseAlert = () => {
    this.setState({snackBar:{message:'', severity:''}});
  }

  _handleGetChats = async () => {
    onValue(ref(fDB, 'chats/' + this.props.eventId), (snapshot) => {
      const dataWithKey = snapshot.val();
      const chats = [];
      if(dataWithKey)
        Object.keys(dataWithKey).forEach(key=>{
          chats.push(dataWithKey[key]);
        });
      this.setState({chats, eventId:this.props.eventId});
    });
  }

  _handleEnterMssg = (e)=> {if(e.key === 'Enter') this._handleSendMssg();}

  triggerSendFile = () => {
    this.fileRef.current.click();
  }

  _handleSendMssg = () => {
    if(this.state.message){
      push(ref(fDB, 'chats/' + this.props.eventId), {
        fullName: userLib.data.fullName,
        uid: fAuth.currentUser.uid,
        message: this.state.message,
        createdAt: Date.now(),
      }).then(()=>{
        this.setState({message:''});
      });
    }
  }

  _handleSendFile = async (e) => {
    const file = e.target.files[0];
    if(file){
  
      const fileSize = file.size;
      if(fileSize > (1000 * 5000)){
        this.setState({snackBar:{message: 'Maaf, ukuran maksimal file adalah 5MB', severity:'error'}});
        return;
      }

      const acceptedExt = ['png', 'jpg', 'jpeg', 'gif'];
      const fileExt = file.name.split('.').reverse()[0];
      
      let type = 'file';
      if(acceptedExt.includes(fileExt?.toLowerCase())){
        type='image';
      }

      this.setState({snackBar:{message: 'Mengunggah file...', severity:'success'}});
      const fileId = Date.now();
      const fileRef = storageRef(storage, `chats/${fileId}`);
      await uploadBytes(fileRef, file)
        .then(async()=>{
          await getDownloadURL(fileRef)
            .then(async url=>{
              push(ref(fDB, 'chats/' + this.props.eventId), {
                fullName: userLib.data.fullName,
                uid: fAuth.currentUser.uid,
                message: {
                  url,
                  title:file.name
                },
                type,
                createdAt: Date.now(),
              }).then(()=>{
                this.setState({message:''});
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

  _handleChangeMessage = (e) => {
    this.setState({message: e.target.value});
  }

  _scrollToBottom = () => {
    this.messagesEnd?.scroll({ top: this.messagesEnd?.scrollHeight, behavior: 'smooth' });
  }

  _renderChats = (chats, loading) => {
    if(loading) return 'Loading...';
    else if(chats.length) return(
      <div className='chats' ref={(el) => { this.messagesEnd = el; }}>
        {chats.map(chat=>(
          <div className={chat.uid === fAuth.currentUser?.uid ? 'right-chat' : 'left-chat'} key={chat.createdAt}>
            <div className='user'>{chat.fullName}</div>
            <div className='chat'>
              {chat.type === 'image' ? 
                <img src={chat.message?.url} style={{width:'100%'}} />:
                chat.type === 'file' ?
                  <a style={{color:'#fff'}} href={chat.message?.url} download target='_blank' rel="noreferrer">{chat.message?.title}</a>:
                  chat.message
              }
            </div>
            <div className='chat-time'>{formattedDate(chat.createdAt, true)}</div>
          </div>
        ))}
      </div>
    );
    else return(
      <div className='no-data'>
        <img src={Images.NO_DATA} />
        <div className='text-no-data'>Belum ada diskusi</div>
      </div>
    );
  }

  render(){
    const {classes, show} = this.props;
    const {chats, message, loading} = this.state;
    return(
      <div className={classes.chatContainer} style={{display: show ? 'block' : 'none'}}>
       
        {this._renderChats(chats, loading)}
      
        {fAuth.currentUser &&
        <div className='chat-footer'>
          <IconButton onClick={this.triggerSendFile}>
            <AttachmentRounded/>
          </IconButton>
          <input hidden type='file' ref={this.fileRef} onChange={this._handleSendFile} />
          <TextField 
            fullWidth
            size='small'
            autoCorrect="false"
            className={classes.textareaChat}
            value={message}
            onChange={this._handleChangeMessage}
            onKeyUp={this._handleEnterMssg}
            inputProps={{
              style: {
                fontSize: 14,
                height: 10,
              }
            }}
          />
          <IconButton onClick={this._handleSendMssg}>
            <SendRounded/>
          </IconButton>
        </div>
        }

        <Snackbar open={Boolean(this.state.snackBar.message)} onClose={this.handleCloseAlert} anchorOrigin={{ vertical:'top', horizontal:'center' }}>
          <Alert onClose={this.handleCloseAlert} severity={this.state.snackBar.severity} sx={{ width: '100%' }}>
            {this.state.snackBar.message}
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

ChatSection.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
  mediaQuery: PropTypes.bool,
  show: PropTypes.bool,
  history:PropTypes.object,
  eventId:PropTypes.string,
};
  
ChatSection.defaultProps = {
  classes: {},
  children: null,
  history:{}
};