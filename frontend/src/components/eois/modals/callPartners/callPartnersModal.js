import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import Loader from '../../../common/loader';
import ControlledModal from '../../../common/modals/controlledModal';
import { newCfeiProcessed, newCfeiFailure, updateCfei } from '../../../../reducers/newCfei';
import CallPartnersForm from './callPartnersForm';

const messages = {
  title: 'A new Call for Expressions of Interest was created.',
  header: {
    title: 'You can inform Partners registered to work in the country(ies) selected about this ' +
    'offer.',
    body: 'This CFEI will be publicly viewable to all, but you can also notify specific partners of this opportunity. If you would like to invite specific partners ' +
    'registered in the portal to apply for the CFEI, enter their names below, and they will receive an e-mail notification. You can also skip this step.',
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

  onFormSubmit(values) {
    this.props.newCfeiProcessed();
    this.props.updateCfei(values);
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
          handleDialogClose={this.onDialogClose}
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
  updateCfei: PropTypes.func,
};

const mapStateToProps = state => ({
  showLoading: state.newCfei.openCfeiSubmitting,
  openDialog: state.newCfei.openCfeiProcessing,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  newCfeiProcessed: () => dispatch(newCfeiProcessed()),
  newCfeiFailure: () => dispatch(newCfeiFailure()),
  updateCfei: body => dispatch(updateCfei(body, ownProps.id)),
  submit: () => dispatch(submit('callPartners')),
});

const containerCallPartnersModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CallPartnersModal);

export default containerCallPartnersModal;
