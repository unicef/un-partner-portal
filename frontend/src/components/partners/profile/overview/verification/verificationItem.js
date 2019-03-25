import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import GridColumn from '../../../../common/grid/gridColumn';
import { formatDateForPrint } from '../../../../../helpers/dates';
import VerificationText from '../../common/verificationText';

const messages = {
  by: 'by',
  questions: 'Verification questions:',
  neverVerified: 'New Organization Profile',
};

const VerificationItem = (props) => {
  const { verification = {} } = props;
  return (
    <Grid item>
      <GridColumn>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item>
            <VerificationText verified={R.prop('is_verified', verification)} />
          </Grid>
          <Grid item>
            <Typography>
              {formatDateForPrint(verification.created) || ''}
            </Typography>
          </Grid>
        </Grid>
        <Typography type="caption">
          {!R.isEmpty(verification)
            ? `${messages.by} ${R.path(['submitter', 'name'], verification)} ${R.path(['submitter', 'agency_name'], verification)}`
            : messages.neverVerified}
        </Typography>
      </GridColumn>
    </Grid>
  );
};

VerificationItem.propTypes = {
  verification: PropTypes.object,
};

export default VerificationItem;
