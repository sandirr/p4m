import { withStyles } from '@mui/styles';
import { MediaQueries } from '../../Elements';
import Payment from './Payment';
import styles from './styles';

const Styled = withStyles(styles)((MediaQueries('(max-width:900px)')(Payment)));

export default Styled;
