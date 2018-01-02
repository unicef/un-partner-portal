import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import Loader from '../../../common/loader';
import ControlledModal from '../../../common/modals/controlledModal';
import { newCfeiProcessed, updateCfei } from '../../../../reducers/newCfei';
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

  onFormSubmit({ invited_partners: partnerIds }) {
    const { partners } = this.props;

    const selectedPartners = partnerIds
        .map(selectedId => partners.find(({ id }) => id === selectedId))
        .filter(Boolean);

    return this.props.updateCfei({
      invited_partners: selectedPartners,
    }).then(() => {
      this.props.newCfeiProcessed();
    });
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
      <Loader loading={showLoading} fullscreen>
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
          content={<CallPartnersForm overlap={false} onSubmit={this.onFormSubmit} />}
        />
      </Loader>
    );
  }
}

CallPartnersModal.propTypes = {
  openDialog: PropTypes.bool,
  showLoading: PropTypes.bool,
  submit: PropTypes.func,
  newCfeiProcessed: PropTypes.func,
  updateCfei: PropTypes.func,
  partners: PropTypes.array,
};

const mapStateToProps = state => ({
  showLoading: state.newCfei.openCfeiSubmitting,
  openDialog: state.newCfei.openCfeiProcessing,
  partners: state.cache.partners,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  newCfeiProcessed: () => dispatch(newCfeiProcessed()),
  updateCfei: body => dispatch(updateCfei(body, ownProps.id)),
  submit: () => dispatch(submit('callPartners')),
});

const containerCallPartnersModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CallPartnersModal);

export default containerCallPartnersModal;
