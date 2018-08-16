import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import CompleteAssessmentModal from '../../../../modals/completeAssessment/completeAssessmentModal';
import withDialogHandling from '../../../../../common/hoc/withDialogHandling';
import ButtonWithTooltipEnabled from '../../../../../common/buttonWithTooltipEnabled';

const messages = {
  completeAssessment: 'complete assessment',
  assessmentCompleted: 'assessment completed',
  completeInfo: 'Score all of your applications before completing assessments',
};


const styleSheet = theme => ({
  root: {
    paddingBottom: `${theme.spacing.unit * 2}px`,
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

const CompleteAssessmentButton = (props) => {
  const { classes, reviewer, handleDialogClose, disabled,
    handleDialogOpen, dialogOpen, ...other } = props;

  return (
    <div className={classes.root}>
      {disabled
        ? <React.Fragment>
          <ButtonWithTooltipEnabled
            name="complete"
            text={messages.completeAssessment}
            tooltipText={messages.completeInfo}
            onClick={handleDialogOpen}
            disabled
          />
        </React.Fragment>
        : <Button
          raised
          color="accent"
          disabled={disabled}
          onClick={handleDialogOpen}
          {...other}
        >
          {disabled ? messages.assessmentCompleted : messages.completeAssessment}
        </Button>}
      <CompleteAssessmentModal
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />
    </div>);
};

CompleteAssessmentButton.propTypes = {
  classes: PropTypes.object,
  reviewer: PropTypes.string,
  disabled: PropTypes.bool,
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
};

const withStyle = withStyles(styleSheet, { name: 'CompleteAssessmentButton' })(CompleteAssessmentButton);

export default withDialogHandling(withRouter(withStyle));

