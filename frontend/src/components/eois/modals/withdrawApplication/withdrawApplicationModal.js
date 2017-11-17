import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import { withRouter } from 'react-router';
import ControlledModal from '../../../common/modals/controlledModal';
import { updateApplication } from '../../../../reducers/applicationDetails';
import WithdrawApplicationForm from './withdrawApplicationForm';

const messages = {
  title: 'Are you sure you want to retract the selection?',
  header: 'Please confirm retraction of selection. The partner will be notified by e-mail.',
  withdraw: 'Yes, retract selection',
};


class awardApplicationModal extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(values) {
    this.props.handleDialogClose();
    this.props.updateApplication({ ...values,
      did_withdraw: true,
      justification_reason: null });
  }

  render() {
    const { submit, dialogOpen, handleDialogClose } = this.props;
    return (
      <div>
        <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={dialogOpen}
          handleDialogClose={handleDialogClose}
          info={{ title: messages.header }}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: submit,
              label: messages.award,
            },
          }}
          content={<WithdrawApplicationForm onSubmit={this.onFormSubmit} />}
        />
      </div >
    );
  }
}

awardApplicationModal.propTypes = {
  dialogOpen: PropTypes.bool,
  submit: PropTypes.func,
  handleDialogClose: PropTypes.func,
  updateApplication: PropTypes.func,
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { params: { applicationId } } = ownProps;
  return {
    updateApplication: body => dispatch(updateApplication(
      applicationId || ownProps.applicationId, body)),
    submit: () => dispatch(submit('withdrawApplication')),
  };
};

const containerAwardApplicationModal = connect(
  null,
  mapDispatchToProps,
)(awardApplicationModal);

export default withRouter(containerAwardApplicationModal);
