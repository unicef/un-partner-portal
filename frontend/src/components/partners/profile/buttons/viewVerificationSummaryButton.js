import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import ViewDetailsModal from '../modals/viewVerificationSummaryModal';
import withDialogHandling from '../../../common/hoc/withDialogHandling';

const messages = {
  label: 'view details',
};


const viewVerificationSummary = (props) => {
  const { verification, handleDialogClose, handleDialogOpen, dialogOpen } = props;
  return (
    <Grid item>
      <Button
        color="accent"
        onClick={handleDialogOpen}
      >
        {messages.label}
      </Button>
      <ViewDetailsModal
        verification={verification}
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />
    </Grid>

  );
};


viewVerificationSummary.propTypes = {
  verification: PropTypes.object,
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
};


export default withDialogHandling(viewVerificationSummary);
