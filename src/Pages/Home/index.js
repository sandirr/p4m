import { withStyles } from '@mui/styles';
import { MediaQueries } from '../../Elements';
import Home from './Home';
import styles from './styles';

const Styled = withStyles(styles)((MediaQueries('(max-width:900px)')(Home)));

export default Styled;
