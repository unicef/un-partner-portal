import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import { withRouter } from 'react-router';
import ControlledModal from '../../../../common/modals/controlledModal';
import { updatePartnerVerifications } from '../../../../../reducers/partnerVerifications';
import AddVerificationForm from './addVerificationForm';
import { selectApplicationPartnerName } from '../../../../../store';

const messages = {
  title: 'Verify a Partner\'s Organization Profile',
  header: 'You are verifying Organization Profile of',
  save: 'verify',
};


class AddVerificationModal extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(values) {
    debugger
    this.props.handleDialogClose();
    this.props.addVerification(values);
  }

  render() {
    const { id, scores, title, submit, dialogOpen, handleDialogClose, partnerName } = this.props;
    return (
      <div>
        <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={dialogOpen}
          info={{ title: `${messages.header}: ${partnerName}` }}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: submit,
              label: messages.save,
            },
          }}
          content={<AddVerificationForm scores={scores} id={id} onSubmit={this.onFormSubmit} />}
        />
      </div >
    );
  }
}

AddVerificationModal.propTypes = {
  dialogOpen: PropTypes.bool,
  id: PropTypes.string,
  submit: PropTypes.func,
  addVerification: PropTypes.func,
  handleDialogClose: PropTypes.func,
  partnerName: PropTypes.string,
  title: PropTypes.string,
  scores: PropTypes.array,
};


const mapStateToProps = (state, ownProps) => {
  const partnerName = state.partnerNames[ownProps.partnerId];
  return {
    partnerName,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { partnerId } = ownProps;
  return {
    addVerification: body => dispatch(updatePartnerVerifications(
      partnerId, body)),
    submit: () => dispatch(submit('addVerification')),
  };
};

const containerAddVerificationModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddVerificationModal);

export default withRouter(containerAddVerificationModal);
