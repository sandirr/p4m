import { Colors } from '../../Configs';

const styles = {
  root:{
    display:'flex',
    flexDirection:'column',
    gap:14,
    paddingTop:10,
    '& .photo-container':{
      background:'grey', 
      width:72, 
      height:72, 
      borderRadius:'50%', 
      overflow:'hidden', 
      position:'relative', 
      alignSelf:'center',
      '& .ganti-photo':{
        display:'none',
      },
      '&:hover .ganti-photo':{
        color:'#fff',
        background:'rgba(0,0,0,.4)',
        position:'absolute',
        top:0,
        right:0,
        bottom:0,
        left:0,
        fontSize:12,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        cursor:'pointer',
      },
    },
  },
  paperBar:{ 
    bgcolor: Colors.white, 
    borderRadius:'16px !important', 
    overflow:'hidden !important',
    boxShadow:'0 0 8px rgba(0,0,0,.1) !important',
    position:'relative',
  },
};

export default styles;