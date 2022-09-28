/* eslint-disable no-unused-vars */
import React, { useEffect, Fragment } from 'react';
import { fetchExternalApi } from '@jitsi/web-sdk';
import { PageBase } from '../../Elements';
import PropTypes from 'prop-types';
import { fAuth } from '../../Configs';
import { getDownloadURL, ref } from 'firebase/storage';
import { firestore, storage } from '../../Configs/firebase';
import { doc, getDoc } from 'firebase/firestore';

const Event = (props) => {
  // const apiRef = useRef();
  // const apiRefNew = useRef();
  const {location} = props;
  
  useEffect(async ()=>{
    // console.log(location.state);
    if(location.state?.eventId){
      const event = location.state;

      let name = fAuth.currentUser?.displayName;
      const userRef = doc(firestore, `users/${fAuth.currentUser.uid}`);
      const userSnap = await getDoc(userRef);
      if(userSnap.exists()){
        name = userSnap.data().fullName;
      }

      await fetchExternalApi('meet.jit.si').then(JitsiMeetExternalApi => {
        const api = new JitsiMeetExternalApi('meet.jit.si', {
          roomName: event.eventTitle,
          // height: 700,
          parentNode: document.getElementById('jitsi-meeting-container'),
          // SHOW_JITSI_WATERMARK: false,
          userInfo:{
            displayName:name,
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
  
        api.addListener('videoConferenceLeft', ()=> {
          props.history.goBack();
        });
        api.addListener('videoConferenceJoined',async ()=>{
          let avatar = fAuth.currentUser?.photoURL;
          const fileRef = ref(storage, `profile-picutre/${fAuth.currentUser.uid}`);
          await getDownloadURL(fileRef)
            .then(url=>{
              avatar = url;
            }).catch((err)=>{
              console.log(err.message);
            });
          api.executeCommand('avatarUrl', avatar);
        });
      });
    }else props.history.replace('/');
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
  location: PropTypes.object,
};
  
Event.defaultProps = {
  classes: {},
  children: null,
  history: {}
};