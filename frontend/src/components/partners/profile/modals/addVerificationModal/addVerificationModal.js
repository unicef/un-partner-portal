import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import { withRouter } from 'react-router';
import ControlledModal from '../../../../common/modals/controlledModal';
import { updatePartnerVerifications } from '../../../../../reducers/partnerVerifications';
import AddVerificationForm from './addVerificationForm';
import { selectApplicationPartnerName } from '../../../../../store';
import VerificationConfirmation from './verificationConfirmation';

const messages = {
  title: 'Verify a Partner\'s Organization Profile',
  header: 'You are verifying Organization Profile of',
  save: 'verify',
  confirmation: 'Confirmation',
};


class AddVerificationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      verification: null,
      error: null };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.closeConfirmation = this.closeConfirmation.bind(this);
  }

  onFormSubmit(values) {

    this.setState({ submitting: true });
    this.props.addVerification(values).then((verification) => {
      this.setState({ verification });
    },
    ).catch((error) => {
      this.setState({ error });
    });
  }

  closeConfirmation() {
    this.setState({ submitting: false });
    this.props.handleDialogClose();
  }

  render() {
    const { submit, dialogOpen, handleDialogClose, partnerName } = this.props;
    const { submitting, verification, error } = this.state;
    console.log(submitting, verification)
    return (
      <div>
        {!submitting && <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={dialogOpen}
          handleDialogClose={handleDialogClose}
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
          content={<AddVerificationForm onSubmit={this.onFormSubmit} />}
        />}
        <ControlledModal
          maxWidth="md"
          title={messages.confirmation}
          trigger={submitting}
          handleDialogClose={this.closeConfirmation}
          buttons={{}}
          content={<VerificationConfirmation
            loading={!verification}
            verification={verification}
            error={error}
          />}
        />
      </div >
    );
  }
}

AddVerificationModal.propTypes = {
  dialogOpen: PropTypes.bool,
  submit: PropTypes.func,
  addVerification: PropTypes.func,
  handleDialogClose: PropTypes.func,
  partnerName: PropTypes.string,
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
