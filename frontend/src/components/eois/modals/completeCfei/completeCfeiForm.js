import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import TextFieldForm from '../../../forms/textFieldForm';
import RadioForm from '../../../forms/radioForm';
import GridColumn from '../../../common/grid/gridColumn';
import { selectNormalizedCompletionReasons, selectCfeiStatus } from '../../../../store';
import { PROJECT_STATUSES } from '../../../../helpers/constants';

const messages = {
  justification: 'Add justification for completing this CFEI',
  reason: 'Choose reason of completing this CFEI',
};

const mapCompletionReasons = (isStatusOpe, isPartnerSelected) => (item) => {
  if (item.value === 'NoC' && isStatusOpe) {
    return { disabled: true, ...item };
  } else if (item.value === 'Par' && !isPartnerSelected) {
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
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  completionReasons: PropTypes.array,
};

const formEditCfei = reduxForm({
  form: 'completeCfei',
})(CompleteCfeiForm);

const mapStateToProps = (state, ownProps) => {
  const completionReasons = selectNormalizedCompletionReasons(state);
  const status = selectCfeiStatus(state, ownProps.id);
  return {
    completionReasons: completionReasons.map(
      mapCompletionReasons(status === PROJECT_STATUSES.OPE, false)),
  };
};

export default connect(
  mapStateToProps,
)(formEditCfei);
