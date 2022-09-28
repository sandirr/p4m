import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';

export default class Help extends Component{
  render(){
    return(
      <Fragment>
        <div>Ada yang bisa kami bantu? email kami ke dgirsandi@gmail.com</div>
      </Fragment>
    );
  }
}

Help.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
  mediaQuery: PropTypes.bool,
  history:PropTypes.object,
};
  
Help.defaultProps = {
  classes: {},
  children: null,
  history:{}
};