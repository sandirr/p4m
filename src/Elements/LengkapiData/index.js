import { withStyles } from '@mui/styles';
import MediaQueries from '../MediaQueries';
import LengkapiData from './LengkapiData';
import styles from './styles';

const Styled = withStyles(styles)((MediaQueries('(max-width:900px)')(LengkapiData)));

export default Styled;
