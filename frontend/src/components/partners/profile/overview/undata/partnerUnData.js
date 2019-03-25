import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GridColumn from '../../../../common/grid/gridColumn';
import PartnerUnDataOverview from './partnerUnDataOverview';
import PartnerUnDataDetails from './partnerUnDataDetails';
import { ROLES } from '../../../../../helpers/constants';

const PartnerOverview = (props) => {
  const { partner, role, params: { id } } = props;

  return (<GridColumn>
    {role === ROLES.AGENCY ? <PartnerUnDataDetails partnerId={id} /> : null}
    <PartnerUnDataOverview partner={partner} />
  </GridColumn>);
};

PartnerOverview.propTypes = {
  partner: PropTypes.object.isRequired,
  params: PropTypes.object,
  role: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  partner: state.agencyPartnerProfile.data[ownProps.params.id] || {},
  role: state.session.role,
});

export default connect(mapStateToProps)(PartnerOverview);
