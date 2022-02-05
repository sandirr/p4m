import { withStyles } from '@mui/styles';
import { MediaQueries } from '../../Elements';
import EventDetails from './EventDetails';
import styles from './styles';

const Styled = withStyles(styles)((MediaQueries('(max-width:900px)')(EventDetails)));

export default Styled;
