import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import ControlledModal from '../../../../common/modals/controlledModal';
import { updatePartnerFlags } from '../../../../../reducers/partnerFlags';
import UpdateObservationForm from './updateObservationForm';
import { FLAGS } from '../../../../../helpers/constants';
import FlagIcon from '../../icons/flagIcon';

const messages = {
  title: 'Update observation',
  info: 'Risk flag',
  save: 'save',
};

class UpdateObservationModal extends Component {
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
    const { submit, id, dialogOpen, handleDialogClose } = this.props;
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
              handleClick: submit,
              label: messages.save,
            },
          }}
          content={<UpdateObservationForm id={id} onSubmit={this.onFormSubmit} />}
        />
      </div >
    );
  }
}

UpdateObservationModal.propTypes = {
  id: PropTypes.number,
  dialogOpen: PropTypes.bool,
  submit: PropTypes.func,
  addFlag: PropTypes.func,
  handleDialogClose: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {

};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { partnerId } = ownProps;
  return {
    addFlag: body => dispatch(updatePartnerFlags(partnerId, body, false)),
    submit: () => dispatch(submit('updateObservationForm')),
  };
};

const connectedUpdateObservationModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UpdateObservationModal);

export default connectedUpdateObservationModal;
