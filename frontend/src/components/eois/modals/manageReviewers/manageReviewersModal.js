import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ControlledModal from '../../../common/modals/controlledModal';
import ManageReviewersForm from './manageReviewers';

const messages = {
  title: 'Edit Expression of Interests',
  header: {
    open: {
      title: 'Choose reviewers for this CFEI',
      body: 'Email wll be sent to selected accounts',
    },
  },
  save: 'send',
};


class ManageReviewersModal extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(values) {
    this.props.handleDialogClose();
  }

  render() {
    const { id, submit, dialogOpen, handleDialogClose } = this.props;
    return (
      <div>
        <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={dialogOpen}
          info={messages.header}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: submit,
              label: messages.save,
            },
          }}
          content={<ManageReviewersForm id={id} onSubmit={this.onFormSubmit} />}
        />
      </div >
    );
  }
}

ManageReviewersModal.propTypes = {
  dialogOpen: PropTypes.bool,
  id: PropTypes.string,
  submit: PropTypes.func,
  handleDialogClose: PropTypes.func,
};

export default ManageReviewersModal;
