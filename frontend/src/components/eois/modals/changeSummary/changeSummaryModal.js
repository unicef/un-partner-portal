import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit, SubmissionError } from 'redux-form';
import ControlledModal from '../../../common/modals/controlledModal';
import { updateReviewSummary } from '../../../../reducers/cfeiReviewSummary';
import ChangeSummaryForm from './changeSummaryForm';
import { changedValues } from '../../../../helpers/apiHelper';
import { selectCfeiReviewSummary } from '../../../../store';

const messages = {
  title: (_, edit) => `${edit ? 'Edit' : 'Add'} Review Summary`,
  header: 'You can provide comments or add an attachment to summarize the review process.',
  error: 'Sorry, update failed',
};


class ChangeSummaryModal extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(values) {
    const { handleDialogClose, updateReviewSummary, initSummary } = this.props;
    return updateReviewSummary(changedValues(initSummary, values))
      .then(() => handleDialogClose())
      .catch((error) => {
        const errorMsg = messages.error;
        throw new SubmissionError({
          ...error.response.data,
          _error: errorMsg,
        });
      });
  }

  render() {
    const { cfeiId, edit, submit, dialogOpen, handleDialogClose } = this.props;

    return (
      <div>
        <ControlledModal
          maxWidth="md"
          title={messages.title`${edit}`}
          trigger={dialogOpen}
          handleDialogClose={handleDialogClose}
          info={{ title: messages.header }}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: submit,
              label: messages.save,
            },
          }}
          content={<ChangeSummaryForm
            form="changeSummary"
            cfeiId={cfeiId}
            onSubmit={this.onFormSubmit}
          />}
        />
      </div >
    );
  }
}

ChangeSummaryModal.propTypes = {
  dialogOpen: PropTypes.bool,
  cfeiId: PropTypes.string,
  submit: PropTypes.func,
  edit: PropTypes.bool,
  updateReviewSummary: PropTypes.func,
  handleDialogClose: PropTypes.func,
  initSummary: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  initSummary: selectCfeiReviewSummary(state, ownProps.cfeiId),
});


const mapDispatchToProps = (dispatch, ownProps) => {
  const { cfeiId } = ownProps;
  return {
    updateReviewSummary: body => dispatch(updateReviewSummary(
      cfeiId, body)),
    submit: () => dispatch(submit('changeSummary')),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangeSummaryModal);
