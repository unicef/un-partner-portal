import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import ModeEdit from 'material-ui-icons/ModeEdit';
import AddReviewModal from '../../../../modals/addReview/addReviewModal';
import withDialogHandling from '../../../../../common/hoc/withDialogHandling';

const messages = {
  title: 'Edit review of the application',
  editReview: 'edit review',
};

const styleSheet = () => ({
  iconContainer: {
    width: 20,
    height: 20,
  },
  editIcon: {
    fill: '#FFFFFF',
    '&:hover': {
      fill: '#8B8C8D',
    },
  },
});


const EditReviewModalButton = (props) => {
  const { classes,
    assessmentId,
    scores,
    reviewer,
    handleDialogClose,
    handleDialogOpen,
    icon,
    dialogOpen,
    ...other } = props;
  return (
    <Grid item>
      {icon
        ? <IconButton onClick={handleDialogOpen} className={classes.iconContainer}>
          <ModeEdit className={classes.editIcon} />
        </IconButton>
        : <Button
          raised
          color="accent"
          onClick={handleDialogOpen}
          {...other}
        >
          {messages.editReview}
        </Button>}
      <AddReviewModal
        scores={scores}
        assessmentId={assessmentId}
        title={messages.title}
        reviewer={reviewer}
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />
    </Grid>

  );
};


EditReviewModalButton.propTypes = {
  classes: PropTypes.object,
  reviewer: PropTypes.string,
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
  scores: PropTypes.object,
  icon: PropTypes.bool,
  assessmentId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};


export default withDialogHandling(withRouter(withStyles(styleSheet)(EditReviewModalButton)));
