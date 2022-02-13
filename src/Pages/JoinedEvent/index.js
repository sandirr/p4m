import { withStyles } from '@mui/styles';
import { MediaQueries } from '../../Elements';
import JoinedEvent from './JoinedEvent';
import styles from './styles';

const Styled = withStyles(styles)((MediaQueries('(max-width:900px)')(JoinedEvent)));

export default Styled;
