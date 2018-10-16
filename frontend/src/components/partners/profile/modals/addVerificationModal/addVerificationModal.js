import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit, formValueSelector } from 'redux-form';
import { withRouter } from 'react-router';
import { loadVerificationsList } from '../../../../../reducers/partnerVerificationsList';
import ControlledModal from '../../../../common/modals/controlledModal';
import { updatePartnerVerifications } from '../../../../../reducers/partnerVerifications';
import AlertDialog from '../../../../common/alertDialog';
import AddVerificationForm from './addVerificationForm';
import VerificationConfirmation from './verificationConfirmation';

const messages = {
  title: 'Verify partner\'s profile',
  header: 'You are verifying Organization Profile of',
  save: 'verify',
  confirmation: 'Confirmation',
  alertTitle: 'Confirm verification',
  confirm: 'Please confirm you want to submit this verification form.',
};


class AddVerificationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      confirmAlert: false,
      verification: null,
      error: null };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.closeConfirmation = this.closeConfirmation.bind(this);
  }

  onFormSubmit(values) {
    this.setState({ values, confirmAlert: true });
  }

  submitConfirmation() {
    const { query } = this.props;

    this.setState({ submitting: true });
    this.props.addVerification(this.state.values)
      .then((verification) => {
        this.setState({ verification });
        this.props.getVerifications(query);
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
    const { submit, dialogOpen, handleDialogClose, partnerName, isConfirmed } = this.props;
    const { submitting, verification, error } = this.state;
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
              disabled: !isConfirmed,
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
        <AlertDialog
          trigger={!!this.state.confirmAlert}
          title={messages.alertTitle}
          text={messages.confirm}
          showCancel
          handleClick={() => this.submitConfirmation()}
          handleDialogClose={() => this.setState({ confirmAlert: false })}
        />
      </div >
    );
  }
}

AddVerificationModal.propTypes = {
  dialogOpen: PropTypes.bool,
  isConfirmed: PropTypes.bool,
  submit: PropTypes.func,
  addVerification: PropTypes.func,
  handleDialogClose: PropTypes.func,
  partnerName: PropTypes.string,
  getVerifications: PropTypes.func,
  query: PropTypes.object,
};

const selector = formValueSelector('addVerification');

const mapStateToProps = (state, ownProps) => {
  const partnerName = state.agencyPartnerProfile.data[ownProps.params.id] ? state.agencyPartnerProfile.data[ownProps.params.id].name : '';
  return {
    isConfirmed: selector(state, 'confirm_verification'),
    partnerName,
    query: ownProps.location.query,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { partnerId } = ownProps;
  return {
    addVerification: body => dispatch(updatePartnerVerifications(
      partnerId, body)),
    submit: () => dispatch(submit('addVerification')),
    getVerifications: params => dispatch(loadVerificationsList(ownProps.params.id, params)),
  };
};

const containerAddVerificationModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddVerificationModal);

export default withRouter(containerAddVerificationModal);
