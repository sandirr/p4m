/* eslint-disable react/display-name */
import { useMediaQuery } from '@mui/material';
import React from 'react';

const withMediaQuery = (...args) => Component => props => {
  const mediaQuery = useMediaQuery(...args);
  return <Component mediaQuery={mediaQuery} {...props} />;
};

export default withMediaQuery;
