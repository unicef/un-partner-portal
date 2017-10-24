import React from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';

import VerifiedUser from 'material-ui-icons/VerifiedUser';


import { withStyles } from 'material-ui/styles';


const styleSheet = theme => ({
  iconNotVerified: {
    fill: theme.palette.primary[500],
    margin: `0 0 0 ${theme.spacing.unit}px`,
  },
  iconVerified: {
    fill: '#009A54',
    margin: `0 0 0 ${theme.spacing.unit}px`,
  },
  iconUnverified: {
    fill: theme.palette.error[500],
    margin: `0 0 0 ${theme.spacing.unit}px`,
  },
});

const VerificationIcon = (props) => {
  const { classes, verified } = props;
  const className = classname({
    [classes.iconVerified]: verified === true,
    [classes.iconUnverified]: verified === false,
    [classes.iconNotVerified]: verified === null,
  })
  return <VerifiedUser className={className} />;
};

VerificationIcon.propTypes = {
  verified: PropTypes.bool,
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'VerificationIcon' })(VerificationIcon);
