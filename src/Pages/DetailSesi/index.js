import { withStyles } from '@mui/styles';
import { MediaQueries } from '../../Elements';
import DetailSesi from './DetailSesi';
import styles from './styles';

const Styled = withStyles(styles)((MediaQueries('(max-width:900px)')(DetailSesi)));

export default Styled;
