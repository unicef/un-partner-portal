import React from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import SpreadContent from '../../../../common/spreadContent';
import PolarRadio from '../../../../forms/fields/PolarRadio';
import TextForm from '../../../../forms/textFieldForm';
import GridColumn from '../../../../common/grid/gridColumn';
import PaddedContent from '../../../../common/paddedContent';
import VerificationIcon from '../../icons/verificationIcon';
import Loader from '../../../../common/loader';
import EmptyContent from '../../../../common/emptyContent';
import { isPartnerVerified } from '../../../../../helpers/verificationUtils';

const messages = {
  status: 'Verification status: ',
  verified: 'Verified',
  unverified: 'Unverified',
  error: 'Verification failed, please try again',
};

const styleSheet = (theme) => {
  const spacing = theme.spacing.unit;
  return {
    padding: {
      padding: `0px ${spacing}px ${spacing}px ${spacing}px`,
      alignItems: 'flex-end',
    },
    questionMargin: {
      marginRight: spacing,
    },
    extraWidth: {
      width: '30vw',
    },
  };
};

const VerificationConfirmation = (props) => {
  const { classes, loading, verification, error } = props;
  let verified = null;
  if (verification) verified = verification.is_verified;
  return (
    <PaddedContent big className={classes.extraWidth}>
      <GridColumn alignItems="center">
        <Typography type="body2">
          {messages.status}
        </Typography>
        <Loader loading={loading}>
          {loading
            ? <EmptyContent />
            : error
              ? <Typography type="headline">
                {messages.error}
              </Typography>
              : <SpreadContent>
                <VerificationIcon verified={verified} />
                <Typography type="headline">
                  {verified ? messages.verified : messages.unverified}
                </Typography>
              </SpreadContent>
          }
        </Loader>
      </GridColumn>
    </PaddedContent>
  );
};

VerificationConfirmation.propTypes = {
  classes: PropTypes.object,
  loading: PropTypes.bool,
  verification: PropTypes.object,
  error: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'VerificationConfirmation' })(VerificationConfirmation);
