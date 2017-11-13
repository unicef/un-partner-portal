import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import WithdrawApplicationModal from '../modals/withdrawApplication/withdrawApplicationModal';
import withDialogHandling from '../../common/hoc/withDialogHandling';

const messages = {
  withdraw: 'retract selection',
};


const WithdrawApplicationButton = (props) => {
  const { applicationId, handleDialogClose, handleDialogOpen, dialogOpen, ...other } = props;
  return (
    <Grid item>
      <Button
        color="accent"
        onClick={handleDialogOpen}
        {...other}
      >
        {messages.withdraw}
      </Button>
      <WithdrawApplicationModal
        applicationId={applicationId}
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />
    </Grid>

  );
};


WithdrawApplicationButton.propTypes = {
  applicationId: PropTypes.string,
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
};


export default withDialogHandling(withRouter(WithdrawApplicationButton));
