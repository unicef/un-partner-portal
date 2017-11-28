import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import AwardApplicationModal from '../modals/awardApplication/awardApplicationModal';
import withDialogHandling from '../../common/hoc/withDialogHandling';

const messages = {
  award: 'Select',
};


const AwardApplicationButton = (props) => {
  const { applicationId, handleDialogClose, handleDialogOpen, dialogOpen, ...other } = props;
  return (
    <Grid item>
      <Button
        raised
        color="accent"
        onClick={handleDialogOpen}
        {...other}
      >
        {messages.award}
      </Button>
      <AwardApplicationModal
        applicationId={applicationId}
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />
    </Grid>

  );
};


AwardApplicationButton.propTypes = {
  applicationId: PropTypes.string,
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
};


export default withDialogHandling(AwardApplicationButton);
