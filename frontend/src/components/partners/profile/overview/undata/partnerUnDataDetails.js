import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { prop, find, propEq } from 'ramda';
import Typography from 'material-ui/Typography';
import HeaderList from '../../../../common/list/headerList';
import SpreadContent from '../../../../common/spreadContent';
import PartnerUndataContent from './partnerUnDataContent';
import PartnerUnDataDetailsMenu from './partnerUnDataDetailsMenu';

const messages = {
  partnerInfo: 'Vendor/Partner information',
};

const fields = partnerId => (
  <PartnerUndataContent partnerId={partnerId} />
);

const summaryHeader = vendorNumber => (
  <SpreadContent>
    <Typography type="title">{messages.partnerInfo}</Typography>
    {!vendorNumber && <PartnerUnDataDetailsMenu />}
  </SpreadContent>);

const PartnerUnDataDetails = (props) => {
  const { partnerId, partner, agencyId } = props;
  const vendorNumber = find(propEq('agency_id', agencyId), prop('vendorNumbers', partner) || []);

  return (
    <div>
      <HeaderList
        header={summaryHeader(vendorNumber)}
      >
        {fields(partnerId)}
      </HeaderList>
    </div>);
};

PartnerUnDataDetails.propTypes = {
  partnerId: PropTypes.string,
  partner: PropTypes.object,
  agencyId: PropTypes.number,
};

const mapStateToProps = (state, ownProps) => ({
  partner: state.agencyPartnerProfile.data[ownProps.partnerId] || {},
  agencyId: state.session.agencyId,
});

export default connect(mapStateToProps)(PartnerUnDataDetails);
