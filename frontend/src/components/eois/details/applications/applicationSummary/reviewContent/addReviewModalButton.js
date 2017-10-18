import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import AddReviewModal from '../../../../modals/addReview/addReviewModal';
import withDialogHandling from '../../../../../common/hoc/withDialogHandling';

const messages = {
  addReview: 'add review',
  title: 'Add review of the application',
};


const AddReviewModalButton = (props) => {
  const { reviewer, handleDialogClose, handleDialogOpen, dialogOpen, ...other } = props;
  return (
    <Grid item>
      <Button
        color="accent"
        onClick={handleDialogOpen}
        {...other}
      >
        {messages.addReview}
      </Button>
      <AddReviewModal
        title={messages.title}
        reviewer={reviewer}
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />
    </Grid>

  );
};


AddReviewModalButton.propTypes = {
  reviewer: PropTypes.string,
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
};


export default withDialogHandling(withRouter(AddReviewModalButton));
