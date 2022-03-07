import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';

export default class FAQ extends Component{
  render(){
    return(
      <Fragment>
        <div>Ada yang bisa kami bantu? email kami ke dgirsandi@gmail.com</div>
      </Fragment>
    );
  }
}

FAQ.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
  mediaQuery: PropTypes.bool,
  history:PropTypes.object,
};
  
FAQ.defaultProps = {
  classes: {},
  children: null,
  history:{}
};