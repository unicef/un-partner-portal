import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import VerificationIcon from '../icons/verificationIcon';

const messages = {
  verified: 'Verified',
  unverified: 'Unverified',
  pending: 'Pending Verification ',
};

const styleSheet = () => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
});

const verifiedText = (status) => {
  if (status) return messages.verified;
  else if (status === false) return messages.unverified;
  return messages.pending;
};

const VerificationText = (props) => {
  const { classes, verified } = props;
  return (<div className={classes.container}>
    <VerificationIcon verified={verified} />
    <Typography type="body2">
      {verifiedText(verified)}
    </Typography>
  </div>);
};

VerificationText.propTypes = {
  verified: PropTypes.bool,
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(VerificationText);
