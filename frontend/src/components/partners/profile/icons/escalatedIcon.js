import React from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';

import { withStyles } from 'material-ui/styles';
import Warning from 'material-ui-icons/Warning';
import { FLAGS } from '../../../../helpers/constants';


const styleSheet = (theme) => {
  const paddingIcon = theme.spacing.unit;
  return {
    icon: {
      width: 20,
      height: 20,
      margin: `0 ${paddingIcon}px 0 0`,
      fill: theme.palette.flags.escalated,
    },
  };
};

const EscalatedIcon = (props) => {
  const { classes } = props;
  return <Warning className={classes.icon} />;
};

EscalatedIcon.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'EscalatedIcon' })(EscalatedIcon);
