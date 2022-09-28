import { withStyles } from '@mui/styles';
import { MediaQueries } from '../../Elements';
import ChatSection from './ChatSection';
import styles from './styles';

const Styled = withStyles(styles)((MediaQueries('(max-width:900px)')(ChatSection)));

export default Styled;
