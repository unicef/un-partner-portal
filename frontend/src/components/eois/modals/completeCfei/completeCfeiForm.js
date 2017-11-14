import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import TextFieldForm from '../../../forms/textFieldForm';
import RadioForm from '../../../forms/radioForm';
import GridColumn from '../../../common/grid/gridColumn';
import { selectNormalizedCompletionReasons } from '../../../../store';

const messages = {
  justification: 'Add justification for completing this CFEI',
  reason: 'Choose reason of completing this CFEI',
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

const mapStateToProps = state => ({
  completionReasons: selectNormalizedCompletionReasons(state),
});

export default connect(
  mapStateToProps,
)(formEditCfei);
