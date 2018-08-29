import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit, SubmissionError } from 'redux-form';
import ControlledModal from '../../../common/modals/controlledModal';
import { addClarificationAnswer } from '../../../../reducers/addClarificationAnswer';
import AddClarificationAnswerForm from './addClarificationAnswerForm';
import { formatDateForPrint } from '../../../../helpers/dates';
import { loadClarificationAnswers } from '../../../../reducers/clarificationAnswers';

const messages = {
  title: 'Upload answer for an additional information/clarifications',
  error: 'Sorry, uploading answer failed',
};

class AddClarificationAnswerModal extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(values) {
    const { handleDialogClose, addAnswer, loadAnswers } = this.props;

    return addAnswer(values)
      .then(() => loadAnswers())
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
    const { formSubmit, dialogOpen, handleDialogClose } = this.props;

    return (
      <div>
        <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={dialogOpen}
          handleDialogClose={handleDialogClose}
          info={{ title: formatDateForPrint(Date()) }}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: formSubmit,
              label: messages.save,
            },
          }}
          content={<AddClarificationAnswerForm
            form={'addClarificationAnswerForm'}
            onSubmit={this.onFormSubmit}
          />}
        />
      </div >
    );
  }
}

AddClarificationAnswerModal.propTypes = {
  dialogOpen: PropTypes.bool,
  formSubmit: PropTypes.func,
  addAnswer: PropTypes.func,
  loadAnswers: PropTypes.func,
  handleDialogClose: PropTypes.func,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  addAnswer: body => dispatch(addClarificationAnswer(ownProps.id, body)),
  loadAnswers: () => dispatch(loadClarificationAnswers(ownProps.id,
    { page: 1, page_size: 5 })),
  formSubmit: () => dispatch(submit('addClarificationAnswerForm')),
});

export default connect(
  null,
  mapDispatchToProps,
)(AddClarificationAnswerModal);
