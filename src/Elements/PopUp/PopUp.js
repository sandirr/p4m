import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import PropTypes from 'prop-types';
import { Colors } from '../../Configs';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PopUp({classes, open, title, children, handleClose, handleNext, noCancel, agreeText, disagreeText, noNext}) {

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      className={classes.root}
      fullWidth={true}
      maxWidth="xs"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        {!noCancel &&
            <Button style={{color:Colors.primary, border:`1px solid ${Colors.primary}`, textTransform:'none'}} onClick={handleClose}>{disagreeText}</Button>
        }
        {!noNext &&
          <Button style={{color:Colors.white, backgroundColor:Colors.primary, textTransform:'none'}} onClick={handleNext}>{agreeText}</Button>
        }
      </DialogActions>
    </Dialog>
  );
}

PopUp.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.node,
  handleClose: PropTypes.func,
  handleNext: PropTypes.func,
  noCancel: PropTypes.bool,
  noNext: PropTypes.bool,
  agreeText: PropTypes.string,
  disagreeText: PropTypes.string,
};

PopUp.defaultProps = {
  classes: {},
  open: false,
  title: '',
  children: null,
  handleClose: null,
  handleNext: null,
  noCancel: false,
  noNext: false,
  agreeText: 'Setuju',
  disagreeText: 'Batal',
};