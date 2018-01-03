import React from 'react';
import { isEmpty } from 'ramda';
import { connect } from 'react-redux';
import { reduxForm, clearSubmitErrors } from 'redux-form';
import PropTypes from 'prop-types';
import Snackbar from 'material-ui/Snackbar';
import GridColumn from '../../../common/grid/gridColumn';
import { selectCfeiReviewSummary } from '../../../../store';
import TextFieldForm from '../../../forms/textFieldForm';
import FileForm from '../../../forms/fileForm';

const messages = {
  labels: {
    comment: 'Comment',
    attachment: 'Attachment',
    commentPlaceholder: 'Add comment for this CFEI',
  },
};

const ChangeSummaryForm = (props) => {
  const { handleSubmit, readOnly, error, clearError, form } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn >
        <TextFieldForm
          fieldName="review_summary_comment"
          label={messages.labels.comment}
          placeholder={messages.commentPlaceholder}
          readOnly={readOnly}
        />
        <FileForm
          fieldName="review_summary_attachment"
          formName={form}
          label={messages.labels.attachment}
          optional
          readOnly={readOnly}
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={error}
          message={error}
          autoHideDuration={6e3}
          onRequestClose={clearError}
        />
      </GridColumn>
    </form >
  );
};

ChangeSummaryForm.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  clearError: PropTypes.func,
  error: PropTypes.string,
  form: PropTypes.string,
};

const formChangeSummaryForm = reduxForm({
  enableReinitialize: true,
})(ChangeSummaryForm);

const mapStateToProps = (state, ownProps) => {
  const summary = selectCfeiReviewSummary(state, ownProps.cfeiId);
  if (!isEmpty(summary)) {
    return {
      initialValues: summary,
    };
  }
  return {};
};

const mapDispatchToProps = dispatch => ({
  clearError: () => dispatch(clearSubmitErrors('changeSummary')),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(formChangeSummaryForm);
