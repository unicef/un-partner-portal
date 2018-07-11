import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import ControlledModal from '../../../../common/modals/controlledModal';
import { updatePartnerFlags } from '../../../../../reducers/partnerFlags';
import UpdateEscalatedObservationForm, { ESCALATION_DECISION } from './updateEscalatedObservationForm';
import { FLAGS } from '../../../../../helpers/constants';
import FlagIcon from '../../icons/flagIcon';

const messages = {
  title: 'Update observation',
  info: 'Risk flag escalated to UN Headquarters Editor',
  save: 'save',
};

class UpdateEscalatedObservationModal extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(values) {
    const { updateFlag, handleDialogClose, id } = this.props;

    let payload = R.clone(values);

    if (values.reason_radio === ESCALATION_DECISION.DEFFERED) {
      payload = R.assoc('is_valid', false, payload);
    } else {
      payload = R.assoc('is_valid', true, payload);
    }

    updateFlag(R.dissoc('attachment', payload), id);
    handleDialogClose();
  }

  render() {
    const { id, dialogOpen, submitForm, handleDialogClose } = this.props;
    const labelInfo = (<div style={{ display: 'flex', alignItems: 'center' }}><FlagIcon color={FLAGS.YELLOW} /> {messages.info}</div>);

    return (
      <div>
        <ControlledModal
          fullWidth
          title={messages.title}
          trigger={dialogOpen}
          handleDialogClose={handleDialogClose}
          info={{ title: labelInfo }}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: submitForm,
              label: messages.save,
            },
          }}
          content={<UpdateEscalatedObservationForm id={id} onSubmit={this.onFormSubmit} />}
        />
      </div >
    );
  }
}

UpdateEscalatedObservationModal.propTypes = {
  id: PropTypes.number,
  dialogOpen: PropTypes.bool,
  updateFlag: PropTypes.func,
  submitForm: PropTypes.func,
  handleDialogClose: PropTypes.func,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateFlag: (body, id) => dispatch(updatePartnerFlags(ownProps.params.id, body, true, id)),
  submitForm: () => dispatch(submit('updateEscalatedObservationForm')),
});

const connectedUpdateEscalatedObservationModal = connect(
  null,
  mapDispatchToProps,
)(UpdateEscalatedObservationModal);

export default withRouter(connectedUpdateEscalatedObservationModal);
