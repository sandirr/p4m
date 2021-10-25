import { Colors } from '../../Configs';

const styles = {
  root:{ display: 'flex', backgroundColor:'#EDF4F7', height:'100vh', overflowY:'auto', width:'100vw' },
  listHead:{
    color:`${Colors.grey60} !important`, 
    fontSize:'14px !important', 
    margin: '10px 10px 5px !important',
  },
  listItemActive:{
    borderRadius:'8px !important',
    backgroundColor:`${Colors.error_light} !important`,
    margin:'4px 0 !important',
    '& .list-icon':{
      color: Colors.primary,
    },
    '& .list-text':{
      color: Colors.primary,
    },
  },
  listItem:{
    borderRadius:'8px !important',
    margin:'4px 0 !important',
    '& .list-icon':{
      color:Colors.icon,
    },
    '&:hover':{
      backgroundColor:`${Colors.error_light} !important`,
      color: Colors.primary,
      '& .list-icon':{
        color: Colors.primary,
      },
      '& .list-text':{
        color: Colors.primary,
      },
    }
  },
};

export default styles;