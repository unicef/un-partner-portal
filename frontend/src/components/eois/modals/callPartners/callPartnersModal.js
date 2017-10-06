import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import Loader from '../../../common/loader';
import ControlledModal from '../../../common/modals/controlledModal';
import { newCfeiProcessed, newCfeiFailure } from '../../../../reducers/newCfei';
import CallPartnersForm from './callPartnersForm';

const messages = {
  title: 'New Expression of Interests was created. Do you want to notify specific partners?',
  header: {
    title: 'You can inform Partners registered to work in the country(ies) selected about this ' +
    'offer.',
    body: 'Email will be sent to selected accounts with a copy of the CFEI inviting them to ' +
    'apply. You can also skip this step.',
  },
  skip: 'skip',
  send: 'send',
};


class CallPartnersModal extends Component {
  constructor(props) {
    super(props);
    this.onDialogSubmit = this.onDialogSubmit.bind(this);
    this.onDialogClose = this.onDialogClose.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit() {
    this.props.newCfeiProcessed();
  }

  onDialogSubmit() {
    this.props.submit();
  }

  onDialogClose() {
    this.props.newCfeiProcessed();
  }

  render() {
    const { openDialog, showLoading } = this.props;
    return (
      <div>
        <Loader loading={showLoading} fullscreen />
        <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={openDialog}
          info={messages.header}
          buttons={{
            flat: {
              handleClick: this.onDialogClose,
              label: messages.skip,
            },
            raised: {
              handleClick: this.onDialogSubmit,
              label: messages.send,
            },
          }}
          content={<CallPartnersForm onSubmit={this.onFormSubmit} />}
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
  openDialog: state.newCfei.openCfeiProcessing,
});

const mapDispatchToProps = dispatch => ({
  newCfeiProcessed: () => dispatch(newCfeiProcessed()),
  newCfeiFailure: () => dispatch(newCfeiFailure()),
  submit: () => dispatch(submit('callPartners')),
});

const containerCallPartnersModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CallPartnersModal);

export default containerCallPartnersModal;
