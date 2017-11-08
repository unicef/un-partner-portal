import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PROJECT_TYPES, ROLES } from '../../../../helpers/constants';
import PartnerOpenHeaderOptions from './partnerOpenHeaderOptions';
import AgencyOpenHeaderOptions from './agencyOpenHeaderOptions';
import AgencyDirectHeaderOptions from './agencyDirectHeaderOptions';
import EoiStatusCell from '../../cells/eoiStatusCell';
import { selectCfeiStatus, isCfeiCompleted, selectCfeiConverted } from '../../../../store';
import GridRow from '../../../common/grid/gridRow';
import ConvertToDS from '../../buttons/convertToDirectSelection';

const HeaderOptionsContainer = (props) => {
  const { role, type, cfeiCompleted, cfeiStatus, cfeiConverted, id, partnerId } = props;
  let options;
  if (type === PROJECT_TYPES.OPEN) {
    if (role === ROLES.AGENCY) {
      options = <AgencyOpenHeaderOptions cfeiCompleted={cfeiCompleted} />;
    } else if (role === ROLES.PARTNER) {
      options = <PartnerOpenHeaderOptions />;
    }
  } else if (type === PROJECT_TYPES.DIRECT && role === ROLES.AGENCY) {
    options = <AgencyDirectHeaderOptions cfeiCompleted={cfeiCompleted} />;
  }
  if (type === PROJECT_TYPES.UNSOLICITED) return !cfeiConverted && role === ROLES.AGENCY ? <ConvertToDS partnerId={partnerId} id={id} /> : null;
  return (<GridRow justify="center" align="center">
    <EoiStatusCell status={cfeiStatus} />
    {options}
  </GridRow>);
};

HeaderOptionsContainer.propTypes = {
  role: PropTypes.string,
  type: PropTypes.string,
  cfeiCompleted: PropTypes.bool,
  cfeiConverted: PropTypes.number,
  cfeiStatus: PropTypes.string,
  id: PropTypes.string,
  partnerId: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  cfeiCompleted: isCfeiCompleted(state, ownProps.id),
  cfeiStatus: selectCfeiStatus(state, ownProps.id),
  cfeiConverted: selectCfeiConverted(state, ownProps.id),
});

export default connect(
  mapStateToProps,
)(HeaderOptionsContainer);
