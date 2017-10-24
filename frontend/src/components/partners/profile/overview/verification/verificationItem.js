import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import SpreadContent from '../../../../common/spreadContent';
import PolarRadio from '../../../../forms/fields/PolarRadio';
import TextForm from '../../../../forms/textFieldForm';
import GridColumn from '../../../../common/grid/gridColumn';
import GridRow from '../../../../common/grid/gridRow';
import PaddedContent from '../../../../common/paddedContent';
import VerificationIcon from '../../icons/verificationIcon';
import Loader from '../../../../common/loader';
import EmptyContent from '../../../../common/emptyContent';
import { countGoodAnswers } from '../../../../../helpers/verificationUtils';
import { formatDateForPrint } from '../../../../../helpers/dates';

const messages = {
  verified: 'Verified',
  unverified: 'Unverified',
  pending: 'Pending Verification ',
  by: 'by',
  questions: 'Verification questions:',
};

const verifiedText = (status) => {
  if (status) return messages.verified;
  else if (status === false) return messages.unverified;
  return messages.pending;
};

const VerificationItem = (props) => {
  const { verification } = props;
  return (
    <Grid item>
      <GridColumn>
        <Grid container direction="row" justify="space-between" align="center">
          <Grid item>
            <Grid container>
              <VerificationIcon verified={verification.is_verified} />
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
          {`${messages.by} ${R.path(['submitter', 'name'], verification)} ${R.path(['submitter', 'agency_name'], verification)}`}
        </Typography>
        {verification.is_verified === false && <Typography type="caption">
          {`${messages.questions} ${countGoodAnswers(verification)}/5`}
        </Typography>}
      </GridColumn>
    </Grid>
  );
};

VerificationItem.propTypes = {
  verification: PropTypes.object,
};

export default VerificationItem;
