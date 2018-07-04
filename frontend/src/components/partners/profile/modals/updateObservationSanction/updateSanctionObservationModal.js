import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import { withRouter } from 'react-router';
import ControlledModal from '../../../../common/modals/controlledModal';
import { updatePartnerFlags } from '../../../../../reducers/partnerFlags';
import UpdateSanctionObservationForm from './updateSanctionObservationForm';
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
    const { addFlag, handleDialogClose } = this.props;
    addFlag(values);
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
  addFlag: PropTypes.func,
  submitForm: PropTypes.func,
  handleDialogClose: PropTypes.func,
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { partnerId } = ownProps;
  return {
    addFlag: body => dispatch(updatePartnerFlags(partnerId, body, false)),
    submitForm: () => dispatch(submit('updateSanctionObservationForm')),
  };
};

const connectedUpdateSanctionObservationModal = connect(
  null,
  mapDispatchToProps,
)(UpdateSanctionObservationModal);

export default withRouter(connectedUpdateSanctionObservationModal);
