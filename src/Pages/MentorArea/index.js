import { withStyles } from '@mui/styles';
import { MediaQueries } from '../../Elements';
import MentorArea from './MentorArea';
import styles from './styles';

const Styled = withStyles(styles)((MediaQueries('(max-width:900px)')(MentorArea)));

export default Styled;
