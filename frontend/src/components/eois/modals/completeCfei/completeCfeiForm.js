import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'ramda';
import { reduxForm } from 'redux-form';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import Grid from 'material-ui';
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
import GridRow from '../../../common/grid/gridRow';

const messages = {
  justification: 'Add justification for completing this CFEI',
  reason: 'Choose reason of completing this CFEI',
};

function selectionOptions() {
  const choices = [{ value: 'och', label: 'ech' }];
  return [
    {
      value: false,
      label: 'Finalized - Partner accepted direct selection',
    },
    {
      value: false,
      label: 'Finalized - Partner accepted retention. Maintain decision for:',
      child:
  <GridRow>
    <GridColumn>
      <SelectForm
        fieldName="retention"
        placeholder="Select time period"
        label="Time period"
        values={choices}
      />
    </GridColumn>
    <GridColumn />
  </GridRow>,
    },
    {
      value: false,
      label: 'Finalized - Cancelled',
      child:
  <TextFieldForm
    fieldName="cancellation"
    placeholder="Add explanation for cancellation"
    label="Explanation for cancellation"
  />,
    },
  ];
}

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

        <RadioForm
          fieldName="cfei_direct_selection"
          label={messages.reason}
          values={selectionOptions()}
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
