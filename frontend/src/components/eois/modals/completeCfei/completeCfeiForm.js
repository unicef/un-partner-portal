import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'ramda';
import { reduxForm } from 'redux-form';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import TextFieldForm from '../../../forms/textFieldForm';
import RadioForm from '../../../forms/radioForm';
import SelectForm from '../../../forms/selectForm';
import GridColumn from '../../../common/grid/gridColumn';
import { selectNormalizedCompletionReasons,
  selectCfeiStatus,
  selectCfeiWinnersStatus,
} from '../../../../store';
import { PROJECT_STATUSES, PROJECT_TYPES } from '../../../../helpers/constants';
import { visibleIfYes, BOOL_VAL } from '../../../../helpers/formHelper';

const messages = {
  justification: 'Add justification for completing this CFEI',
  reason: 'Choose reason of completing this CFEI',
};

const selectionOptions = {
  directSelection: [{
    value: true,
    label: 'Finalized - Partner accepted direct selection',
  }],

  retention: [{
    value: true,
    label: 'Finalized - Partner accepted retention. Maintain decision for:'
  }],

  cancelled: [{
    value: true,
    label: 'Finalized - Cancelled',
  }],
};

const mapCompletionReasons = (disableNoC, disablePar) => (item) => {
  if (item.value === 'NoC' && disableNoC) {
    return { disabled: true, ...item };
  } else if (item.value === 'Par' && disablePar) {
    return { disabled: true, ...item };
  }
  return item;
};

const CompleteCfeiForm = (props) => {
  const { handleSubmit, completionReasons } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <TextFieldForm
          fieldName="justification"
          label={messages.justification}
          placeholder="Enter comment..."
          column
        />
        <RadioForm
          fieldName="cfei_direct_selection"
          label={messages.reason}
          values={selectionOptions.directSelection}
          column
        />
        <SelectForm 
          fieldName="select_time_period"
          placeholder="Select time period"
          values={completionReasons}
          column
        />
        <RadioForm
          fieldName="cfei_retention"
          // label={selectionOptions.retention}
          values={selectionOptions.retention}
          column
        />
        <RadioForm
          fieldName="cfei_cancelled"
          values={selectionOptions.cancelled}
          column
        />
      </GridColumn>

    </form >
  );
};

CompleteCfeiForm.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  completionReasons: PropTypes.array,
};

const formEditCfei = reduxForm({
  form: 'completeCfei',
})(CompleteCfeiForm);

const mapStateToProps = (state, { params: { id, type } }) => {
  const completionReasons = selectNormalizedCompletionReasons(state);
  const status = selectCfeiStatus(state, id);
  const reviewStarted = (status === PROJECT_STATUSES.OPE && type !== PROJECT_TYPES.DIRECT);
  const hasWinners = selectCfeiWinnersStatus(state, id);
  return {
    completionReasons: completionReasons.map(
      mapCompletionReasons(reviewStarted, !hasWinners)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps),
)(formEditCfei);
