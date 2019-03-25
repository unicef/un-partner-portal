import { prop, find, propEq } from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Loader from '../../../../../common/loader';
import ControlledModal from '../../../../../common/modals/controlledModal';
import PaddedContent from '../../../../../common/paddedContent';
import { deleteVendorNumber } from '../../../../../../reducers/deleteVendorNumber';
import { getPartnerUnData } from '../../../../../../reducers/partnerUnData';

const messages = {
  title: 'Delete the Partner\'s vendor number/partner ID',
  confirmInfo: 'Please confirm you want to delete vendor number/partner ID.',
  partnerName: 'Partner Name: ',
  vendorId: 'Vendor/Partner ID: ',
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
    const { removeVendorNumber, agencyId, partner, partnerId, loadUnData } = this.props;

    const vendorNumber = find(propEq('agency_id', agencyId), prop('vendorNumbers', partner) || []);

    removeVendorNumber(vendorNumber.id, partnerId)
      .then(() => {
        loadUnData(agencyId);
        this.props.handleDialogClose();
      });
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
    </PaddedContent>);
  }

  render() {
    const { dialogOpen, handleDialogClose, partner, agencyId, showLoading } = this.props;
    const vendorNumber = find(propEq('agency_id', agencyId), prop('vendorNumbers', partner) || []);

    return (
      <React.Fragment>
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
        <Loader loading={showLoading} fullscreen />
      </React.Fragment>
    );
  }
}

DeleteVendorNumberModal.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  removeVendorNumber: PropTypes.func,
  loadUnData: PropTypes.func,
  partner: PropTypes.object,
  showLoading: PropTypes.bool,
  partnerId: PropTypes.string,
  agencyId: PropTypes.number,
};

const mapStateToProps = (state, ownProps) => ({
  partner: state.agencyPartnerProfile.data[ownProps.params.id] || {},
  agencyId: state.session.agencyId,
  partnerId: ownProps.params.id,
  showLoading: state.removeVendorNumber.deleteVendorNumberSubmitting,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  removeVendorNumber: (vendorId, partnerId) => dispatch(deleteVendorNumber(vendorId, partnerId)),
  loadUnData: agencyId => dispatch(getPartnerUnData(agencyId, ownProps.params.id)),
});

const connectedDeleteVendorNumberModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DeleteVendorNumberModal);

const withRouterModal = withRouter(connectedDeleteVendorNumberModal);

export default (withStyles(styleSheet, { name: 'deleteVendorNumberModal' })(withRouterModal));
