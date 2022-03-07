import { withStyles } from '@mui/styles';
import { MediaQueries } from '../../Elements';
import FAQ from './FAQ';
import styles from './styles';

const Styled = withStyles(styles)((MediaQueries('(max-width:900px)')(FAQ)));

export default Styled;
