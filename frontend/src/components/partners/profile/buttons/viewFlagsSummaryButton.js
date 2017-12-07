import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import FlagsSummaryModal from '../modals/flagsSummaryModal/flagsSummaryModal';
import withDialogHandling from '../../../common/hoc/withDialogHandling';

const messages = {
  label: 'view details',
};


const ViewFlagsSummaryButton = (props) => {
  const { flagItems: { yellow: yelFlag, red: redFlag }, handleDialogClose, handleDialogOpen, dialogOpen } = props;
  return (
    <Grid item>
      <Button
        color="accent"
        onClick={handleDialogOpen}
      >
        {messages.label}
      </Button>
      <FlagsSummaryModal
        yelFlag={yelFlag}
        redFlag={redFlag}
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />
    </Grid>

  );
};


ViewFlagsSummaryButton.propTypes = {
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
};


export default withDialogHandling(ViewFlagsSummaryButton);
