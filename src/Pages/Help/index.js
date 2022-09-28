import { withStyles } from '@mui/styles';
import { MediaQueries } from '../../Elements';
import Bantuan from './Help';
import styles from './styles';

const Styled = withStyles(styles)((MediaQueries('(max-width:900px)')(Bantuan)));

export default Styled;
