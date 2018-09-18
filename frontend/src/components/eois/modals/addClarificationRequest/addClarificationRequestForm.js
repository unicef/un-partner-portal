import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, clearSubmitErrors } from 'redux-form';
import PropTypes from 'prop-types';
import Snackbar from 'material-ui/Snackbar';
import GridColumn from '../../../common/grid/gridColumn';
import TextFieldForm from '../../../forms/textFieldForm';

const messages = {
  labels: {
    comment: 'Comments',
    commentPlaceholder: 'Enter additional details',
  },
};

const AddClarificationRequestForm = (props) => {
  const { handleSubmit, error, clearError, form } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn >
        <TextFieldForm
          fieldName="question"
          textFieldProps={{
            multiline: true,
            InputProps: {
              inputProps: {
                maxLength: '5000',
              },
            },
          }}
          label={messages.labels.comment}
          placeholder={messages.labels.commentPlaceholder}
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={error}
          message={error}
          autoHideDuration={6e3}
          onClose={clearError}
        />
      </GridColumn>
    </form >
  );
};

AddClarificationRequestForm.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  clearError: PropTypes.func,
  error: PropTypes.string,
  form: PropTypes.string,
};

const formAddClarificationRequestForm = reduxForm({
  enableReinitialize: true,
})(AddClarificationRequestForm);

const mapDispatchToProps = dispatch => ({
  clearError: () => dispatch(clearSubmitErrors('addClarificationForm')),
});

export default connect(
  null,
  mapDispatchToProps,
)(formAddClarificationRequestForm);
