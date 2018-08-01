import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import DeleteVendorNumberModal from '../overview/undata/partnerVendor/deleteVendorNumberModal';
import withDialogHandling from '../../../common/hoc/withDialogHandling';

const messages = {
  label: 'Delete',
};


const viewVerificationSummary = (props) => {
  const { handleDialogClose, handleDialogOpen, dialogOpen } = props;
  return (
    <Grid item>
      <Button
        color="accent"
        onClick={handleDialogOpen}
      >
        {messages.label}
      </Button>
      <DeleteVendorNumberModal
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
