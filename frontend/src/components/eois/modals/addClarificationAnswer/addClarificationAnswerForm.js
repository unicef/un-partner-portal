import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, clearSubmitErrors } from 'redux-form';
import PropTypes from 'prop-types';
import Snackbar from 'material-ui/Snackbar';
import GridColumn from '../../../common/grid/gridColumn';
import TextFieldForm from '../../../forms/textFieldForm';
import FileForm from '../../../forms/fileForm';

const messages = {
  labels: {
    comment: 'Title',
    commentPlaceholder: 'Enter title of file',
    document: 'Document',
  },
};

const AddClarificationAnswerForm = (props) => {
  const { handleSubmit, error, clearError, form } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn >
        <TextFieldForm
          fieldName="title"
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
        <FileForm
          fieldName="file"
          label={messages.labels.document}
          formName={form}
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

AddClarificationAnswerForm.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  clearError: PropTypes.func,
  error: PropTypes.string,
  form: PropTypes.string,
};

const formAddClarificationAnswerForm = reduxForm({
  enableReinitialize: true,
})(AddClarificationAnswerForm);

const mapDispatchToProps = dispatch => ({
  clearError: () => dispatch(clearSubmitErrors('addClarificationAnswerForm')),
});

export default connect(
  null,
  mapDispatchToProps,
)(formAddClarificationAnswerForm);
