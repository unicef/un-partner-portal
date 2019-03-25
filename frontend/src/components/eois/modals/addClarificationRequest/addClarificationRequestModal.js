import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit, SubmissionError } from 'redux-form';
import ControlledModal from '../../../common/modals/controlledModal';
import { addClarificationRequest } from '../../../../reducers/addClarificationRequest';
import AddClarificationRequestForm from './addClarificationRequestForm';
import { formatDateForPrint } from '../../../../helpers/dates';
import { loadClarificationRequests } from '../../../../reducers/clarificationRequests';

const messages = {
  title: 'This is a new request for an additional information/clarification',
  error: 'Sorry, adding request failed',
};

class AddClarificationRequestModal extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(values) {
    const { handleDialogClose, addRequest, loadRequests } = this.props;

    return addRequest(values)
      .then(() => loadRequests())
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
          info={{ title: formatDateForPrint(new Date()) }}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: formSubmit,
              label: messages.save,
            },
          }}
          content={<AddClarificationRequestForm
            form={'addClarificationForm'}
            onSubmit={this.onFormSubmit}
          />}
        />
      </div >
    );
  }
}

AddClarificationRequestModal.propTypes = {
  dialogOpen: PropTypes.bool,
  formSubmit: PropTypes.func,
  addRequest: PropTypes.func,
  loadRequests: PropTypes.func,
  handleDialogClose: PropTypes.func,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  addRequest: body => dispatch(addClarificationRequest(ownProps.id, body)),
  loadRequests: () => dispatch(loadClarificationRequests(ownProps.id,
    { page: 1, page_size: 5 })),
  formSubmit: () => dispatch(submit('addClarificationForm')),
});

export default connect(
  null,
  mapDispatchToProps,
)(AddClarificationRequestModal);
