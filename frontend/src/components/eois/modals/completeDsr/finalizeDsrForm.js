import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'ramda';
import { reduxForm, formValueSelector } from 'redux-form';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import GridColumn from '../../../common/grid/gridColumn';
import TextFieldForm from '../../../forms/textFieldForm';
import RadioForm from '../../../forms/radioForm';
import SelectForm from '../../../forms/selectForm';
import {
  selectNormalizedDsrFinalizeOptions,
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
  const { handleSubmit, completionReasons, timePeriods, completedReason, hasWinners } = props;
  const checkIfNotCancelled = completedReason !== 'cancelled';
  const checkIfAccepted = completedReason === 'accepted_retention' || completedReason === 'accepted';
  const completedReasonAccepted = [];
  const completedReasonCancelled = [];
  completedReasonCancelled.push(completionReasons[0]);
  completedReasonAccepted.push(completionReasons[1]);
  const acceptedWithRetention = completedReasonAccepted[0].value === 'accepted_retention';
  const acceptedRegular = completedReasonAccepted[0].value === 'accepted';

  const formControlStyle = {
    marginLeft: '20px',
    paddingRight: '20px',
  };

  const commentFormControlStyle = {
    paddingBottom: '12px',
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextFieldForm
        fieldName="justification"
        placeholder={messages.justificationPlaceholder}
        label={messages.justificationLabel}
        commentFormControlStyle={commentFormControlStyle}
      />
      {acceptedRegular && <RadioForm
        label={messages.completedReasonLabel}
        fieldName="completed_reason"
        values={completedReasonAccepted}
        disabled={!hasWinners}
        column
      />}
      {acceptedWithRetention && 
        <RadioForm
          fieldName="completed_reason"
          values={completedReasonAccepted}
          disabled={!hasWinners}
          column
        />}
      {checkIfAccepted && <SelectForm
        fieldName="completed_retention"
        placeholder={messages.retentionPlaceholder}
        label={messages.retentionLabel}
        values={timePeriods}
        formControlStyle={formControlStyle}
      />}
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
  handleSubmit: PropTypes.func.isRequired,
  completionReasons: PropTypes.array,
  timePeriods: PropTypes.array,
  hasWinners: PropTypes.bool,
  completedReason: PropTypes.string,
};

const finalizeDsr = reduxForm({
  form: 'finalizeDsr',
})(FinalizeDsrForm);

const mapStateToProps = (state, { params: { id, type } }) => {
  const completionReasons = selectNormalizedDsrFinalizeOptions(state);
  const status = selectCfeiStatus(state, id);
  const reviewStarted = (status === PROJECT_STATUSES.OPE && type !== PROJECT_TYPES.DIRECT);
  const hasWinners = selectCfeiWinnersStatus(state, id);
  const selector = formValueSelector('finalizeDsr');
  return {
    hasWinners,
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
