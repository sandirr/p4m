import { Colors } from '../../Configs';

const styles ={
  chatContainer:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-between',
    '& .chats':{
      display:'flex', 
      flexDirection:'column', 
      gap:6, 
      height:'38vh !important',
      overflow:'auto',
      '&::-webkit-scrollbar':{
        display:'none',
      },
      '& .left-chat':{
        maxWidth:'80%', 
        minWidth: '40%',
        alignSelf:'flex-start', 
        position:'relative',
        '& .chat':{
          backgroundColor:Colors.grey60,
          padding:'18px 12px 16px',
          fontWeight:'bold',
          borderRadius:'18px 18px 18px 0',
          color:'#fff',
          fontSize:12,
          lineHeight:1.2
        },
      },
      '& .right-chat':{
        maxWidth:'80%', 
        minWidth: '40%',
        alignSelf:'flex-end', 
        position:'relative',
        '& .chat':{
          backgroundColor:Colors.info,
          padding:'18px 12px 16px',
          fontWeight:'bold',
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
        fontSize:10,
        fontWeight:'bold',
        color:'#fff'
      },
      '& .chat-time':{
        position:'absolute',
        right:12,
        bottom:2,
        fontSize:10,
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
  },
};
export default styles;