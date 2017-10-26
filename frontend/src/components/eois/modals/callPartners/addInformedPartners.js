import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import Loader from '../../../common/loader';
import ControlledModal from '../../../common/modals/controlledModal';
import { updateCfei } from '../../../../reducers/newCfei';
import CallPartnersForm from './callPartnersForm';

const messages = {
  title: 'Invite Partners',
  header: {
    title: 'You can inform Partners registered to work in the country(ies) selected about this ' +
    'offer.',
    body: 'Email will be sent to selected accounts with a copy of the CFEI inviting them to ' +
    'apply.',
  },
  skip: 'skip',
  send: 'send',
};


class CallPartnersModal extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(values) {
    this.props.handleDialogClose();
    this.props.updateCfei(values);
  }


  render() {
    const { id, submit, dialogOpen, handleDialogClose } = this.props;
    return (
      <div>
        <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={dialogOpen}
          handleDialogClose={this.onDialogClose}
          info={messages.header}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: submit,
              label: messages.save,
            },
          }}
          content={<CallPartnersForm id={id} onSubmit={this.onFormSubmit} />}
        />
      </div >
    );
  }
}

CallPartnersModal.propTypes = {
  openDialog: PropTypes.bool,
  showLoading: PropTypes.bool,
  submit: PropTypes.func,
  newCfeiProcessed: PropTypes.func,
  newCfeiFailure: PropTypes.func,
};

const mapStateToProps = state => ({
  showLoading: state.newCfei.openCfeiSubmitting,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateCfei: body => dispatch(updateCfei(body, ownProps.id)),
  submit: () => dispatch(submit('callPartners')),
});

const containerCallPartnersModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CallPartnersModal);

export default containerCallPartnersModal;
