import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GridColumn from '../../../../common/grid/gridColumn';
import PartnerUnDataOverview from './partnerUnDataOverview';
import PartnerUnDataDetails from './partnerUnDataDetails';

const PartnerOverview = (props) => {
  const { partner, params: { id } } = props;

  return (<GridColumn>
    <PartnerUnDataDetails partnerId={id} />
    <PartnerUnDataOverview partner={partner} />
  </GridColumn>);
};

PartnerOverview.propTypes = {
  partner: PropTypes.object.isRequired,
  params: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  partner: state.agencyPartnerProfile.data[ownProps.params.id] || {},
});

export default connect(mapStateToProps)(PartnerOverview);
