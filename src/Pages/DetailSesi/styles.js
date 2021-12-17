import { Colors } from '../../Configs';

const styles ={
  paperBar:{ 
    bgcolor: Colors.white, 
    borderRadius:'16px !important', 
    overflow:'hidden !important',
    boxShadow:'0 0 8px rgba(0,0,0,.1) !important',
    position:'relative',
  },
  tabs:{
    '& :hover': {
      color: Colors.primary,
      opacity: 1,
    },
    '& .Mui-selected': {
      color: `${Colors.primary} !important`,
      fontWeight: 'bold',
    },
    '& .Mui-focusVisible': {
      backgroundColor: `${Colors.primary} !important`,
    },
    '& .tab':{
      textTransform:'none', 
      fontSize:12, 
      fontWeight:'bold !important',
    },
  },
  textareaChat:{
    '& .MuiOutlinedInput-root.Mui-focused':{
      '& .MuiOutlinedInput-notchedOutline':{
        borderColor: `${Colors.success} !important`
      },
    },
  },
  chatContainer:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-between',
    '& .chats':{
      display:'flex', 
      flexDirection:'column', 
      gap:6, 
      maxHeight:'55vh', 
      minHeight:'20vh', 
      overflow:'auto',
      '& .left-chat':{
        maxWidth:'80%', 
        alignSelf:'flex-start', 
        position:'relative',
        '& .chat':{
          backgroundColor:Colors.grey60,
          padding:'16px 12px 12px',
          borderRadius:'18px 18px 18px 0',
          color:'#fff',
          fontSize:12,
          lineHeight:1.2
        },
      },
      '& .right-chat':{
        maxWidth:'80%', 
        alignSelf:'flex-end', 
        position:'relative',
        '& .chat':{
          backgroundColor:Colors.info,
          padding:'16px 12px 12px',
          borderRadius:'18px 18px 0 18px',
          color:'#fff',
          fontSize:12,
          lineHeight:1.2
        },
      },
      '& .user':{
        position:'absolute',
        left:12,
        top:2,
        fontSize:8,
        fontWeight:'bold',
        color:'#fff'
      },
      '& .chat-time':{
        position:'absolute',
        right:12,
        bottom:2,
        fontSize:8,
        fontWeight:'500',
        color:'#fff'
      },
    },
    '& .chat-footer':{
      display:'flex',
      alignItems:'center',
      justifyContent:'space-between',
      boxSizing:'content-box',
      overflow:'hidden',
      paddingTop:5
    },
  }
};
export default styles;