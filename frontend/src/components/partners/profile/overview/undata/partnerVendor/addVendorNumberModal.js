import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import { withRouter } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Loader from '../../../../../common/loader';
import ControlledModal from '../../../../../common/modals/controlledModal';
import AddVendorNumberForm from './addVendorNumberForm';
import PaddedContent from '../../../../../common/paddedContent';
import { Typography } from '../../../../../../../node_modules/material-ui';
import { addVendorNumber } from '../../../../../../reducers/vendorNumber';

const messages = {
  title: 'Add the Partner\'s vendor number/partner ID',
  header: 'Entering the partner\'s vendor number/partner ID below will result in disursement data to the partner to be displayed to both the UN and the partner.',
  confirmTitle: 'Confirm vendor number/partner ID',
  confirmInfo: 'Please confirm you want to display the information below. This information will be visible to the partner and other UN agencies',
  partnerName: 'Partner Name: ',
  vendorId: 'Vendor/Partner ID: ',
  area: 'Implementing Business Area: ',
  display: 'Yes, Display',
  submit: 'submit',
};

const styleSheet = () => ({
  center: {
    display: 'flex',
    alignItems: 'center',
  },
});

class AddVendorNumberModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmation: false,
      payload: null,
      error: null };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.closeConfirmation = this.closeConfirmation.bind(this);
    this.confirmData = this.confirmData.bind(this);
    this.vendorNumberRequest = this.vendorNumberRequest.bind(this);
  }

  onFormSubmit(values) {
    const { partnerId } = this.props;
    const payload = R.assoc('partner', partnerId, values);
    this.setState({ showConfirmation: true, payload });
  }

  closeConfirmation() {
    this.setState({ showConfirmation: false });
    this.props.handleDialogClose();
  }

  vendorNumberRequest() {
    const { postVendorNumber, partnerId } = this.props;

    postVendorNumber(this.state.payload, partnerId)
      .then(() => this.closeConfirmation());
  }

  confirmData() {
    const { partnerName, classes } = this.props;
    const { payload } = this.state;
    return (payload && <PaddedContent>
      <div className={classes.center}>
        <Typography type="body2">{messages.partnerName}</Typography>&nbsp;
        <Typography type="body1">{partnerName}</Typography>
      </div>
      <div className={classes.center}>
        <Typography type="body2">{messages.vendorId}</Typography>&nbsp;
        <Typography type="body1">{payload.number}</Typography>
      </div>
      <div className={classes.center}>
        <Typography type="body2">{messages.area}</Typography>&nbsp;
        <Typography type="body1">{payload.business_area}</Typography>
      </div>
    </PaddedContent>);
  }

  render() {
    const { submit, dialogOpen, handleDialogClose, showLoading } = this.props;
    return (
      <React.Fragment>
        {!this.state.showConfirmation && <ControlledModal
          maxWidth="sm"
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
              label: messages.submit,
            },
          }}
          content={<AddVendorNumberForm onSubmit={this.onFormSubmit} />}
        />}

        <ControlledModal
          maxWidth="sm"
          title={messages.confirmTitle}
          info={{ title: messages.confirmInfo }}
          trigger={this.state.showConfirmation}
          handleDialogClose={handleDialogClose}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: this.vendorNumberRequest,
              label: messages.display,
            },
          }}
          content={this.confirmData()}
        />

        <Loader loading={showLoading} fullscreen />
      </React.Fragment>
    );
  }
}

AddVendorNumberModal.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool,
  submit: PropTypes.func,
  handleDialogClose: PropTypes.func,
  partnerName: PropTypes.string,
  postVendorNumber: PropTypes.func,
  partnerId: PropTypes.string,
  showLoading: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
  const partnerName = state.agencyPartnerProfile.data[ownProps.params.id] ? state.agencyPartnerProfile.data[ownProps.params.id].name : '';

  return {
    partneId: ownProps.params.id,
    partnerName,
    query: ownProps.location.query,
    showLoading: state.vendorNumber.newVendorNumberSubmitting,
  };
};

const mapDispatchToProps = dispatch => ({
  submit: () => dispatch(submit('addVendorNumberForm')),
  postVendorNumber: (data, partnerId) => dispatch(addVendorNumber(data, partnerId)),
});

const connectedAddVendorNumberModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddVendorNumberModal);

const withRouterModal = withRouter(connectedAddVendorNumberModal);

export default (withStyles(styleSheet, { name: 'addVendorNumberModal' })(withRouterModal));
