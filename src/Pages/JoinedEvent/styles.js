import { Colors } from '../../Configs';

const styles = () => ({
  root:{
    '& .event-title':{
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      '-webkit-line-clamp': 2, /* number of lines to show */
      '-webkit-box-orient': 'vertical',
      color:Colors.black,
      fontSize:14
    },
    '& .card-item':{
      boxShadow:'0 0 8px rgba(0,0,0,.1)', 
      position:'relative',
      borderRadius:10,
      '& .category':{
        backgroundColor:Colors.info_light, 
        color:Colors.info,
        padding:'6px 10px 6px 5px',
        display:'inline-block',
        borderRadius:'0 25px 25px 0',
        position:'absolute',
        top:110,
        left:0,
        fontSize:12,
        fontWeight:'500'
      },
      '& .price':{
        fontWeight:'500',
        fontSize:14
      },
      '& .event-date':{
        color: Colors.info,
        marginBottom:4,
        display:'flex',
        alignItems:'center',
        marginLeft:-2
      },
      '& .joined':{
        color: Colors.primary_light,
        marginTop:4,
        display:'flex',
        alignItems:'center',
        marginLeft:-2,
      },
      '& .desc-icon':{fontSize:16, marginRight:5},
      '& .participants':{
        fontSize:12,
        marginLeft:5,
        fontWeight:'500',
      }
    }
  },
  paperBar:{ 
    bgcolor: Colors.white, 
    borderRadius:'16px !important', 
    overflow:'hidden !important',
    boxShadow:'0 0 8px rgba(0,0,0,.1) !important',
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
      fontSize:14, 
      fontWeight:'400 !important'
    },
  },
  noBorder:{
    border: 'none !important',
  }
});

export default styles;