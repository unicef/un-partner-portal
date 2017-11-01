import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import GridColumn from '../../../../common/grid/gridColumn';
import VerificationIcon from '../../icons/verificationIcon';
import { countGoodAnswers } from '../../../../../helpers/verificationUtils';
import { formatDateForPrint } from '../../../../../helpers/dates';
import VerificationDetails from '../../buttons/viewVerificationSummaryButton';

const messages = {
  verified: 'Verified',
  unverified: 'Unverified',
  pending: 'Pending Verification ',
  by: 'by',
  questions: 'Verification questions:',
  neverVerified: 'New Organization Profile',
};

const verifiedText = (status) => {
  if (status) return messages.verified;
  else if (status === false) return messages.unverified;
  return messages.pending;
};

const VerificationItem = (props) => {
  const { verification = {} } = props;
  return (
    <Grid item>
      <GridColumn>
        <Grid container direction="row" justify="space-between" align="center">
          <Grid item>
            <Grid container>
              <VerificationIcon verified={R.prop('is_verified', verification)} />
              <Typography type="body2">
                {verifiedText(verification.is_verified)}
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography>
              {formatDateForPrint(verification.created)}
            </Typography>
          </Grid>
        </Grid>
        <Typography type="caption">
          {!R.isEmpty(verification)
            ? `${messages.by} ${R.path(['submitter', 'name'], verification)} ${R.path(['submitter', 'agency_name'], verification)}`
            : messages.neverVerified}
        </Typography>
        {verification.is_verified === false && <Typography type="caption">
          {`${messages.questions} ${countGoodAnswers(verification)}/5`}
        </Typography>}
        {!R.isEmpty(verification) && <Grid container justify="flex-end">
          <Grid item>
            <VerificationDetails verification={verification} />
          </Grid>
        </Grid> }
      </GridColumn>
    </Grid>
  );
};

VerificationItem.propTypes = {
  verification: PropTypes.object,
};

export default VerificationItem;
