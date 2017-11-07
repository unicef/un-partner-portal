import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import VerificationIcon from '../icons/verificationIcon';

const messages = {
  verified: 'Verified',
  unverified: 'Unverified',
  pending: 'Pending Verification ',
};

const verifiedText = (status) => {
  if (status) return messages.verified;
  else if (status === false) return messages.unverified;
  return messages.pending;
};

const VerificationText = (props) => {
  const { verified } = props;
  return (<Grid container spacing={0}>
    <Grid item>
      <VerificationIcon verified={verified} />
    </Grid>
    <Grid item>
      <Typography type="body2">
        {verifiedText(verified)}
      </Typography>
    </Grid>
  </Grid>);
};

VerificationText.propTypes = {
  verified: PropTypes.bool,
};

export default VerificationText;
