import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PROJECT_TYPES, ROLES } from '../../../../helpers/constants';
import PartnerOpenHeaderOptions from './partnerOpenHeaderOptions';
import AgencyOpenHeaderOptions from './agencyOpenHeaderOptions';
import AgencyDirectHeaderOptions from './agencyDirectHeaderOptions';
import EoiStatusCell from '../../cells/eoiStatusCell';
import { selectCfeiStatus,
  isCfeiCompleted,
  selectCfeiConverted,
  isUserAFocalPoint,
  isUserACreator,
} from '../../../../store';
import GridRow from '../../../common/grid/gridRow';
import ConvertToDS from '../../buttons/convertToDirectSelection';

const HeaderOptionsContainer = (props) => {
  const { role,
    type,
    cfeiCompleted,
    cfeiStatus,
    cfeiConverted,
    id,
    partnerId,
    allowedToEdit,
  } = props;
  let options;
  if (type === PROJECT_TYPES.OPEN) {
    if (role === ROLES.AGENCY) {
      options = (allowedToEdit && !cfeiCompleted) ? <AgencyOpenHeaderOptions /> : null;
    } else if (role === ROLES.PARTNER) {
      options = <PartnerOpenHeaderOptions />;
    }
  } else if (type === PROJECT_TYPES.DIRECT && role === ROLES.AGENCY) {
    options = (allowedToEdit && !cfeiCompleted) ? <AgencyDirectHeaderOptions /> : null;
  }
  if (type === PROJECT_TYPES.UNSOLICITED) {
    return !cfeiConverted && role === ROLES.AGENCY
      ? <ConvertToDS partnerId={partnerId} id={id} />
      : null;
  }
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
  allowedToEdit: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  cfeiCompleted: isCfeiCompleted(state, ownProps.id),
  cfeiStatus: selectCfeiStatus(state, ownProps.id),
  cfeiConverted: selectCfeiConverted(state, ownProps.id),
  allowedToEdit: isUserAFocalPoint(state, ownProps.id) || isUserACreator(state, ownProps.id),
});

export default connect(
  mapStateToProps,
)(HeaderOptionsContainer);
