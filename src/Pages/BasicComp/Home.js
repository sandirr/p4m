import React, {Component} from 'react';
import {PageBase} from '../../Elements';
import PropTypes from 'prop-types';

export default class Home extends Component{
  render(){
    return(
      <PageBase>
        <div>ok</div>
      </PageBase>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
  mediaQuery: PropTypes.bool,
  history:PropTypes.object,
};
  
Home.defaultProps = {
  classes: {},
  children: null,
  history:{}
};