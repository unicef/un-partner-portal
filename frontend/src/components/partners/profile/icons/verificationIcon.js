import React from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';

import VerifiedUser from 'material-ui-icons/VerifiedUser';


import { withStyles } from 'material-ui/styles';


const styleSheet = theme => ({
  iconNotVerified: {
    fill: theme.palette.primary[500],
    margin: 0,
  },
  iconVerified: {
    fill: theme.palette.common.statusOk,
    margin: 0,
  },
  iconUnverified: {
    fill: theme.palette.error[500],
    margin: 0,
  },
});

const VerificationIcon = (props) => {
  const { classes, verified } = props;
  const className = classname({
    [classes.iconVerified]: verified === true,
    [classes.iconUnverified]: verified === false,
    [classes.iconNotVerified]: verified === null || verified === undefined,
  });
  return <VerifiedUser className={className} />;
};

VerificationIcon.propTypes = {
  verified: PropTypes.bool,
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'VerificationIcon' })(VerificationIcon);
