/* eslint-disable no-unused-vars */
import React, { useEffect, Fragment } from 'react';
import { fetchExternalApi } from '@jitsi/web-sdk';
import { PageBase } from '../../Elements';
import PropTypes from 'prop-types';

const Event = (props) => {
  // const apiRef = useRef();
  // const apiRefNew = useRef();
  
  useEffect(()=>{
    fetchExternalApi('meet.jit.si').then(JitsiMeetExternalApi => {
      const api = new JitsiMeetExternalApi('meet.jit.si', {
        roomName: 'WorkshopPentingnyaNgajiAlam',
        // height: 700,
        parentNode: document.getElementById('jitsi-meeting-container'),
        // SHOW_JITSI_WATERMARK: false,
        userInfo:{
          displayName:'baco',
        },
        interfaceConfigOverwrite:{
          SHOW_JITSI_WATERMARK:false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          VIDEO_LAYOUT_FIT: 'nocrop',
        },
        configOverwrite:{
          startWithAudioMuted: true,
        },
      });

      // api.executeCommand('avatarUrl', 'https://avatars0.githubusercontent.com/u/3671647');
      api.addListener('videoConferenceLeft', ()=> {
        props.history.replace('/');
      });
    });
  },[]);


  return (
    <Fragment>
      <div style={{height:'92%'}} id="jitsi-meeting-container" />
    </Fragment>
  );
};

export default Event;

Event.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
  mediaQuery: PropTypes.bool,
  history: PropTypes.object,
};
  
Event.defaultProps = {
  classes: {},
  children: null,
  history: {}
};