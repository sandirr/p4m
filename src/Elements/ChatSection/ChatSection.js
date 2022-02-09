import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { IconButton, TextField } from '@mui/material';
import { AttachmentRounded, SendRounded } from '@mui/icons-material';
import {ref, onValue, push} from 'firebase/database';
import { fAuth, fDB, Images } from '../../Configs';
import { formattedDate, userLib } from '../../Helpers';

export default class ChatSection extends Component{

  constructor(props){
    super(props);
    this.state = {
      chats:[],
      message:'',

      loading:false,
      eventId:''
    };
  }

  componentDidUpdate(){
    this._scrollToBottom();
    if(this.props.eventId && this.props.eventId !== this.state.eventId)
      this._handleGetChats();
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

  _handleChangeMessage = (e) => {
    this.setState({message: e.target.value});
  }

  _scrollToBottom = () => {
    this.messagesEnd?.scrollIntoView({ behavior: 'smooth' });
  }

  _renderChats = (chats, loading) => {
    if(loading) return 'Loading...';
    else if(chats.length) return(
      <div className='chats'>
        {chats.map(chat=>(
          <div className={chat.uid === fAuth.currentUser?.uid ? 'right-chat' : 'left-chat'} key={chat.createdAt}>
            <div className='user'>{chat.fullName}</div>
            <div className='chat'>
              {chat.message}
            </div>
            <div className='chat-time'>{formattedDate(chat.createdAt, true)}</div>
          </div>
        ))}
        <div ref={(el) => { this.messagesEnd = el; }}/>
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
          <IconButton>
            <AttachmentRounded/>
          </IconButton>
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