import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import ControlledModal from '../../../../common/modals/controlledModal';
import { updatePartnerFlags } from '../../../../../reducers/partnerFlags';
import AddFlagForm from './addFlagForm';
import { FLAGS } from '../../../../../helpers/constants';
import FlagIcon from '../../icons/flagIcon';

const messages = {
  title: (_, flag) => {
    let type;
    switch (flag) {
      case FLAGS.YELLOW:
      default:
        type = 'Yellow';
        break;
      case FLAGS.RED:
        type = 'Red';
    }
    return `Are you sure you want to add ${type} Flag to this Profile?`;
  },
  header: (_, flag) => {
    let type;
    switch (flag) {
      case FLAGS.YELLOW:
      default:
        type = 'Yellow';
        break;
      case FLAGS.RED:
        type = 'Red';
    }
    return `${type} Flag`;
  },
  info: (_, flag) => {
    let type;
    switch (flag) {
      case FLAGS.YELLOW:
      default:
        type = 'Alleged';
        break;
      case FLAGS.RED:
        type = 'Confirmed';
    }
    return `${type} fraud, corruption, ethical concern, or other reputational risk`;
  },
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
    const { submit, dialogOpen, handleDialogClose, flag } = this.props;
    return (
      <div>
        <ControlledModal
          maxWidth="md"
          title={messages.title`${flag}`}
          trigger={dialogOpen}
          handleDialogClose={handleDialogClose}
          info={{ title: <div><FlagIcon color={flag} />{messages.header`${flag}`}</div>, body: messages.info`${flag}` }}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: submit,
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
  submit: PropTypes.func,
  addFlag: PropTypes.func,
  handleDialogClose: PropTypes.func,
  flag: PropTypes.string,
};


const mapStateToProps = (state, ownProps) => {
  const partnerName = state.partnerNames[ownProps.partnerId];
  return {
    partnerName,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { partnerId, flag } = ownProps;
  return {
    addFlag: body => dispatch(updatePartnerFlags(
      partnerId, { ...body, flag_type: flag }, false)),
    submit: () => dispatch(submit('addFlag')),
  };
};

const containerAddFlagModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddFlagModal);

export default containerAddFlagModal;
