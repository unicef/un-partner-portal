import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import { PROJECT_TYPES, ROLES } from '../../../../helpers/constants';
import PartnerOpenHeaderOptions from './partnerOpenHeaderOptions';
import AgencyOpenHeaderOptions from './agencyOpenHeaderOptions';
import AgencyDirectHeaderOptions from './agencyDirectHeaderOptions';
import EoiStatusCell from '../../cells/eoiStatusCell';
import { selectCfeiStatus, isCfeiCompleted } from '../../../../store';
import SpreadContent from '../../../common/spreadContent';
import GridRow from '../../../common/grid/gridRow';

const HeaderOptionsContainer = (props) => {
  const { role, type, cfeiCompleted, cfeiStatus } = props;
  let options;
  if (type === PROJECT_TYPES.OPEN) {
    if (role === ROLES.AGENCY) {
      options = <AgencyOpenHeaderOptions cfeiCompleted={cfeiCompleted} />;
    } else if (role === ROLES.PARTNER) {
      options = <PartnerOpenHeaderOptions />;
    }
  } else if (type === PROJECT_TYPES.DIRECT) {
    options = <AgencyDirectHeaderOptions cfeiCompleted={cfeiCompleted} />;
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
  cfeiStatus: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  cfeiCompleted: isCfeiCompleted(state, ownProps.id),
  cfeiStatus: selectCfeiStatus(state, ownProps.id),
});


export default connect(
  mapStateToProps,
)(HeaderOptionsContainer);
