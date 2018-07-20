import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import { withRouter } from 'react-router';
import ControlledModal from '../../../../common/modals/controlledModal';
import { updatePartnerFlags } from '../../../../../reducers/partnerFlags';
import UpdateSanctionObservationForm, { SANCATION_DECISION } from './updateSanctionObservationForm';
import { FLAGS } from '../../../../../helpers/constants';
import FlagIcon from '../../icons/flagIcon';

const messages = {
  title: 'Update observation',
  info: 'Risk flag',
  save: 'save',
};

class UpdateSanctionObservationModal extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(values) {
    const { updateFlag, handleDialogClose, id } = this.props;

    let payload = R.clone(values);

    if (values.reason_radio === SANCATION_DECISION.NOTMATCH) {
      payload = R.assoc('is_valid', false, payload);
    } else {
      payload = R.assoc('is_valid', true, payload);
    }

    updateFlag(R.dissoc('category', R.dissoc('attachment', payload)), id);
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
          content={<UpdateSanctionObservationForm id={id} onSubmit={this.onFormSubmit} />}
        />
      </div >
    );
  }
}

UpdateSanctionObservationModal.propTypes = {
  id: PropTypes.number,
  dialogOpen: PropTypes.bool,
  updateFlag: PropTypes.func,
  submitForm: PropTypes.func,
  handleDialogClose: PropTypes.func,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateFlag: (body, id) => dispatch(updatePartnerFlags(ownProps.params.id, body, true, id)),
  submitForm: () => dispatch(submit('updateSanctionObservationForm')),
});

const connectedUpdateSanctionObservationModal = connect(
  null,
  mapDispatchToProps,
)(UpdateSanctionObservationModal);

export default withRouter(connectedUpdateSanctionObservationModal);
