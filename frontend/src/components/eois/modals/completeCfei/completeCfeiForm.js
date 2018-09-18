import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'ramda';
import { reduxForm } from 'redux-form';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import TextFieldForm from '../../../forms/textFieldForm';
import RadioForm from '../../../forms/radioForm';
import GridColumn from '../../../common/grid/gridColumn';
import { selectNormalizedCompletionReasons,
  selectCfeiStatus,
  selectCfeiWinnersStatus,
} from '../../../../store';
import { PROJECT_STATUSES, PROJECT_TYPES } from '../../../../helpers/constants';

const messages = {
  justification: 'Add justification for completing this CFEI',
  reason: 'Choose reason of completing this CFEI',
};

const mapCompletionReasons = (disableNoC, disablePar) => (item) => {
  if (item.value === 'no_candidate' && disableNoC) {
    return { disabled: true, ...item };
  } else if (item.value === 'partners' && disablePar) {
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
          fieldName="completed_reason"
          label={messages.reason}
          values={completionReasons}
          column
        />
        <TextFieldForm
          fieldName="justification"
          label={messages.justification}
          placeholder="Enter comment..."
        />
      </GridColumn>

    </form >
  );
};

CompleteCfeiForm.propTypes = {
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
