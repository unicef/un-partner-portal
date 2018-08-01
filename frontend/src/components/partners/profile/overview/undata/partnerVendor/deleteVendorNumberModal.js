import { prop, find, propEq } from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import { withRouter } from 'react-router';
import { withStyles } from 'material-ui/styles';
import ControlledModal from '../../../../../common/modals/controlledModal';
import AddVendorNumberForm from './addVendorNumberForm';
import PaddedContent from '../../../../../common/paddedContent';
import { Typography } from '../../../../../../../node_modules/material-ui';
import { deleteVendorNumber } from '../../../../../../reducers/deleteVendorNumber';

const messages = {
  title: 'Delete the Partner\'s vendor number/partner ID',
  confirmInfo: 'Please confirm you want to delete vendor number/partner ID.',
  partnerName: 'Partner Name: ',
  vendorId: 'Vendor/Partner ID: ',
  area: 'Implementing Business Area: ',
  delete: 'Delete',
};

const styleSheet = () => ({
  center: {
    display: 'flex',
    alignItems: 'center',
  },
});

class DeleteVendorNumberModal extends Component {
  constructor(props) {
    super(props);

    this.confirmData = this.confirmData.bind(this);
    this.vendorNumberRequest = this.vendorNumberRequest.bind(this);
  }

  vendorNumberRequest() {
    const { removeVendorNumber, agencyId, partner } = this.props;

    const vendorNumber = find(propEq('agency_id', agencyId), prop('vendorNumbers', partner) || []);

    removeVendorNumber(vendorNumber.id)
      .then(() => this.props.handleDialogClose());
  }

  confirmData(vendorNumber) {
    const { partner, classes } = this.props;

    return (vendorNumber && <PaddedContent>
      <div className={classes.center}>
        <Typography type="body2">{messages.partnerName}</Typography>&nbsp;
        <Typography type="body1">{partner.name}</Typography>
      </div>
      <div className={classes.center}>
        <Typography type="body2">{messages.vendorId}</Typography>&nbsp;
        <Typography type="body1">{vendorNumber.number}</Typography>
      </div>
      <div className={classes.center}>
        <Typography type="body2">{messages.area}</Typography>&nbsp;
        <Typography type="body1">{vendorNumber.business_area}</Typography>
      </div>
    </PaddedContent>);
  }

  render() {
    const { dialogOpen, handleDialogClose, partner, agencyId } = this.props;
    const vendorNumber = find(propEq('agency_id', agencyId), prop('vendorNumbers', partner) || []);

    return (
      <div>
        <ControlledModal
          maxWidth="sm"
          title={messages.title}
          trigger={dialogOpen}
          handleDialogClose={handleDialogClose}
          info={{ title: messages.confirmInfo }}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: this.vendorNumberRequest,
              label: messages.delete,
            },
          }}
          content={this.confirmData(vendorNumber)}
        />
      </div>
    );
  }
}

DeleteVendorNumberModal.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  removeVendorNumber: PropTypes.func,
  partner: PropTypes.object,
  partnerId: PropTypes.string,
  agencyId: PropTypes.number,
};

const mapStateToProps = (state, ownProps) => ({
  partner: state.agencyPartnerProfile.data[ownProps.params.id] || {},
  agencyId: state.session.agencyId,
  partnerId: ownProps.params.id,
});

const mapDispatchToProps = dispatch => ({
  removeVendorNumber: vendorId => dispatch(deleteVendorNumber(vendorId)),
});

const connectedDeleteVendorNumberModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DeleteVendorNumberModal);

const withRouterModal = withRouter(connectedDeleteVendorNumberModal);

export default (withStyles(styleSheet, { name: 'deleteVendorNumberModal' })(withRouterModal));
