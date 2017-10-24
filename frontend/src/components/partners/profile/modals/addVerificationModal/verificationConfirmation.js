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

const messages = {
  status: 'Verification status: ',
  verified: 'Verified',
  unverified: 'Unverified',
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
  };
};

const VerificationConfirmation = (props) => {
  const { classes, loading, verification, error } = props;
  return (
    <PaddedContent big>
      <GridColumn align="center">
        <Typography type="body2">
          {messages.status}
        </Typography>
        <Loader loading={loading}>
          {loading
            ? <EmptyContent />
            : <SpreadContent>
              <VerificationIcon verified={true} />
              <Typography type="headline">
                {messages.unverified}
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
  question: PropTypes.string,
  questionFieldName: PropTypes.string,
  commentFieldName: PropTypes.string,
};

export default withStyles(styleSheet, { name: 'VerificationConfirmation' })(VerificationConfirmation);
