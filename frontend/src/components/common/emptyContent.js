import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';


const styleSheet = () => ({
  root: {
    minHeight: 55,
  },
});

const EmptyContent = ({ classes }) => (
  <div className={classes.root} />
);

EmptyContent.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'EmptyContent' })(EmptyContent);
