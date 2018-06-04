import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'ramda';
import { reduxForm, formValueSelector } from 'redux-form';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import GridRow from '../../../common/grid/gridRow';
import TextFieldForm from '../../../forms/textFieldForm';
import RadioForm from '../../../forms/radioForm';
import SelectForm from '../../../forms/selectForm';
import { selectNormalizedDsrFinalizeOptions,
  selectNormalizedTimePeriods,
  selectCfeiStatus,
  selectCfeiWinnersStatus,
} from '../../../../store';
import { PROJECT_STATUSES, PROJECT_TYPES } from '../../../../helpers/constants';

const messages = {
  cancellationExplanationLabel: 'Explanation for cancellation ',
  cancellationExplanationPlaceholder: 'Add explanation for cancellation',
  justificationLabel: 'Add justification for completing this direct selection/retenion:',
  justificationPlaceholder: 'Enter Comment...',
  completedReasonLabel: 'Choose reason for finalzing this direct selection/retention:',
  retentionPlaceholder: 'Select time period',
  retentionLabel: 'Time period:',
  
};

const mapCompletionReasons = (disableNoC, disablePar) => (item) => {
  if (item.value === 'NoC' && disableNoC) {
    return { disabled: true, ...item };
  } else if (item.value === 'Par' && disablePar) {
    return { disabled: true, ...item };
  }
  return item;
};

const FinalizeDsrForm = (props) => {
  const { classes, handleSubmit, completionReasons, timePeriods, completedReason } = props;
  const completedReasonAccepted = [];
  const completedReasonRetention = [];
  const completedReasonCancelled = [];
  const checkIfNotRetention = completedReason !== 'accepted_retention';
  const checkIfNotCancelled = completedReason !== 'cancelled';

  const formControlStyle = {
    marginLeft: '20px',
    paddingRight: '20px',
  };

  const commentFormControlStyle = {
    paddingBottom: '12px',
  };

  completedReasonAccepted.push(completionReasons[1]);
  completedReasonRetention.push(completionReasons[2]);
  completedReasonCancelled.push(completionReasons[0]);

  return (
    <form onSubmit={handleSubmit}>
      <TextFieldForm
        fieldName="completion_justification"
        placeholder={messages.justificationPlaceholder}
        label={messages.justificationLabel}
        commentFormControlStyle={commentFormControlStyle}
      />
      <RadioForm
        label={messages.completedReasonLabel}
        fieldName="completed_reason"
        values={completedReasonAccepted}
        column
      />
      <RadioForm
        fieldName="completed_reason"
        values={completedReasonRetention}
        column
      />
      <GridRow>
        <Grid>
          <SelectForm
            fieldName="retention"
            placeholder={messages.retentionPlaceholder}
            label={messages.retentionLabel}
            values={timePeriods}
            optional={checkIfNotRetention}
            selectFieldProps={{
              disabled: checkIfNotRetention,
            }}
            formControlStyle={formControlStyle}
          />
        </Grid>
        <Grid />
      </GridRow>
      <RadioForm
        fieldName="completed_reason"
        values={completedReasonCancelled}
        column
      />
      <TextFieldForm
        fieldName="cancellation_explanation"
        placeholder={messages.cancellationExplanationPlaceholder}
        label={messages.cancellationExplanationLabel}
        optional={checkIfNotCancelled}
        textFieldProps={{
          disabled: checkIfNotCancelled,
        }}
        formControlStyle={formControlStyle}
      />
    </form >
  );
};

FinalizeDsrForm.propTypes = {
  classes: PropTypes.object,
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  completionReasons: PropTypes.array,
  timePeriods: PropTypes.array,
  disabled: PropTypes.string,
};

const finalizeDsr = reduxForm({
  form: 'finalizeDsr',
})(FinalizeDsrForm);

const mapStateToProps = (state, { params: { id, type } }, ownProps) => {
  const completionReasons = selectNormalizedDsrFinalizeOptions(state);
  const status = selectCfeiStatus(state, id);
  const reviewStarted = (status === PROJECT_STATUSES.OPE && type !== PROJECT_TYPES.DIRECT);
  const hasWinners = selectCfeiWinnersStatus(state, id);
  const selector = formValueSelector('finalizeDsr');
  return {
    completionReasons: completionReasons.map(
      mapCompletionReasons(reviewStarted, !hasWinners)),
    timePeriods: selectNormalizedTimePeriods(state),
    completedReason: selector(state, 'completed_reason'),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps),
)(finalizeDsr);
