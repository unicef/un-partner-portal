
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { prop, find, propEq } from 'ramda';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import PaddedContent from '../../../../common/paddedContent';
import DeleteVendorNumber from '../../buttons/deleteVendorNumber';
import { checkPermission, AGENCY_PERMISSIONS } from '../../../../../helpers/permissions';

const messages = {
  vendorID: 'Vendor/Partner ID:',
  delete: 'Delete',
};

const styleSheet = (theme) => {
  const padding = theme.spacing.unit * 2;

  return {
    center: {
      display: 'flex',
      alignItems: 'center',
    },
    delete: {
      display: 'flex',
      justifyContent: 'flex-end',
      paddingTop: `${padding}px`,
    },
  };
};

class PartnerUnDataContent extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  render() {
    const { classes, partner, agencyId, hasVendorPermission } = this.props;
    const vendorNumber = find(propEq('agency_id', agencyId), prop('vendorNumbers', partner) || []);

    return (<div>
      <PaddedContent>
        <div className={classes.center}>
          <Typography type="body2">{messages.vendorID}</Typography>&nbsp;
          <Typography type="body1">{vendorNumber ? vendorNumber.number : '-'}</Typography>
        </div>
        {vendorNumber && hasVendorPermission && <div className={classes.delete}>
          <DeleteVendorNumber />
        </div>}
      </PaddedContent>
    </div>);
  }
}

PartnerUnDataContent.propTypes = {
  classes: PropTypes.object,
  partner: PropTypes.object,
  agencyId: PropTypes.number,
  hasVendorPermission: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  partner: state.agencyPartnerProfile.data[ownProps.partnerId] || {},
  agencyId: state.session.agencyId,
  hasVendorPermission: checkPermission(AGENCY_PERMISSIONS.ERP_ENTER_VENDOR_NUMBER, state),
});

const connected = connect(mapStateToProps)(PartnerUnDataContent);

export default (withStyles(styleSheet, { name: 'partnerUnDataContent' })(connected));
