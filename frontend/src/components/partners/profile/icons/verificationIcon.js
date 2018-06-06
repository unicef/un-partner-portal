import React from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';
import VerifiedUser from 'material-ui-icons/VerifiedUser';
import { withStyles } from 'material-ui/styles';


const styleSheet = theme => ({
  iconSmall: {
    padding: theme.spacing.unit / 2,
  },
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
  const { classes, verified, small } = props;
  const className = classname({
    [classes.iconSmall]: small === true,
    [classes.iconVerified]: verified === true,
    [classes.iconUnverified]: verified === false,
    [classes.iconNotVerified]: verified === null || verified === undefined,
  });
  return <VerifiedUser className={className} />;
};

VerificationIcon.propTypes = {
  verified: PropTypes.bool,
  classes: PropTypes.object,
  small: PropTypes.bool,
};

export default withStyles(styleSheet, { name: 'VerificationIcon' })(VerificationIcon);
