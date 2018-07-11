import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import ControlledModal from '../../../../common/modals/controlledModal';
import { updatePartnerFlags } from '../../../../../reducers/partnerFlags';
import AddFlagForm from './addFlagForm';

const messages = {
  title: 'Are you sure you want to add an observation to this Profile?',
  info: 'An observation can be added to record brief UN notes collaboration history, partner performance or other key issues.',
  save: 'save',
};


class AddFlagModal extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(values) {
    const { addFlag, handleDialogClose } = this.props;
    addFlag(values);
    handleDialogClose();
  }

  render() {
    const { submitForm, dialogOpen, handleDialogClose } = this.props;
    return (
      <div>
        <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={dialogOpen}
          handleDialogClose={handleDialogClose}
          info={{ title: messages.info }}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: submitForm,
              label: messages.save,
            },
          }}
          content={<AddFlagForm onSubmit={this.onFormSubmit} />}
        />
      </div >
    );
  }
}

AddFlagModal.propTypes = {
  dialogOpen: PropTypes.bool,
  submitForm: PropTypes.func,
  addFlag: PropTypes.func,
  handleDialogClose: PropTypes.func,
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { partnerId } = ownProps;
  return {
    addFlag: body => dispatch(updatePartnerFlags(partnerId, body, false)),
    submitForm: () => dispatch(submit('addFlag')),
  };
};

const containerAddFlagModal = connect(
  null,
  mapDispatchToProps,
)(AddFlagModal);

export default containerAddFlagModal;
