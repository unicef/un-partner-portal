import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import Tooltip from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';
import { PROJECT_TYPES, ROLES } from '../../../../helpers/constants';
import PartnerOpenHeaderOptions from './partnerOpenHeaderOptions';
import AgencyOpenHeaderOptions from './agencyOpenHeaderOptions';
import AgencyDirectHeaderOptions from './agencyDirectHeaderOptions';
import PartnerDirectHeaderOptions from './partnerDirectHeaderOptions';
import EoiStatusHeader from '../../cells/eoiStatusHeader';
import { selectCfeiStatus,
  isCfeiPublished,
  isCfeiCompleted,
  selectCfeiConverted,
  selectCfeiCompletedReasonDisplay,
  selectPartnerVerified,
} from '../../../../store';
import ConvertToDS from '../../buttons/convertToDirectSelection';
import PartnerUcnHeaderOptions from './partnerUcnHeaderOptions';
import { checkPermission, AGENCY_PERMISSIONS } from '../../../../helpers/permissions'; 

const messages = {
  infoDsr: 'This direct selection/retention was sent to the focal point for review and issuance to the selected partner.',
  infoCfei: 'This CFEI was sent to Focal Point for acceptance and publication',
  infoUcn: 'This UCN was forwarded for acceptance and publication',
};

const tooltipInfo = (projectType) => {
  switch (projectType) {
    case PROJECT_TYPES.OPEN:
      return messages.infoCfei;
    case PROJECT_TYPES.DIRECT:
      return messages.infoDsr;
    case PROJECT_TYPES.UNSOLICITED:
      return messages.infoUcn;
    default:
      return '';
  }
};

const HeaderOptionsContainer = (props) => {
  const { role,
    type,
    cfeiCompleted,
    cfeiStatus,
    cfeiConverted,
    id,
    partnerId,
    completedReasonDisplay,
    hasDsrConvertPermission,
    partnerVerified,
  } = props;
  let options;
  let status = <EoiStatusHeader status={cfeiStatus} />;

  if (type === PROJECT_TYPES.OPEN) {
    if (role === ROLES.AGENCY) {
      options = !cfeiCompleted ? <AgencyOpenHeaderOptions id={id} /> : null;
    } else if (role === ROLES.PARTNER) {
      options = <PartnerOpenHeaderOptions />;
    }
  } else if (type === PROJECT_TYPES.DIRECT) {
    if (role === ROLES.AGENCY) {
      options = <AgencyDirectHeaderOptions id={id} />;
    } else if (role === ROLES.PARTNER) {
      options = <PartnerDirectHeaderOptions id={id} />;
    }
  } else if (type === PROJECT_TYPES.UNSOLICITED && role === ROLES.PARTNER) {
    options = <PartnerUcnHeaderOptions id={id} />;
  }
  if (type === PROJECT_TYPES.UNSOLICITED && role === ROLES.AGENCY && hasDsrConvertPermission) {
    return !cfeiConverted ? <ConvertToDS partnerVerified={partnerVerified} partnerId={partnerId} id={id} /> : null;
  }

  if (cfeiStatus === 'Sen') {
    status = (<Tooltip
      title={tooltipInfo(type)}
      placement="bottom"
    >
      <div>
        <EoiStatusHeader status={cfeiStatus} />
        <Typography type="caption">{completedReasonDisplay || ''}</Typography>
      </div>
    </Tooltip>);
  }

  return (
    <Grid container direction="row" alignItems="center" wrap="nowrap" spacing={24}>
      <Grid item>
        <div>
          {status}
          {completedReasonDisplay && <Typography type="caption">{completedReasonDisplay || ''}</Typography>}
        </div></Grid>
      <Grid item>{options}</Grid>
    </Grid>
  );
};

HeaderOptionsContainer.propTypes = {
  role: PropTypes.string,
  type: PropTypes.string,
  cfeiCompleted: PropTypes.bool,
  hasDsrConvertPermission: PropTypes.bool,
  partnerVerified: PropTypes.bool,
  cfeiConverted: PropTypes.number,
  cfeiStatus: PropTypes.string,
  id: PropTypes.string,
  partnerId: PropTypes.string,
  completedReasonDisplay: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  cfeiCompleted: isCfeiCompleted(state, ownProps.id),
  cfeiPublished: isCfeiPublished(state, ownProps.id),
  cfeiStatus: selectCfeiStatus(state, ownProps.id),
  completedReasonDisplay: selectCfeiCompletedReasonDisplay(state, ownProps.id),
  cfeiConverted: selectCfeiConverted(state, ownProps.id),
  partnerVerified: selectPartnerVerified(state, ownProps.id),
  hasDsrConvertPermission: checkPermission(AGENCY_PERMISSIONS.UCN_CONVERT_TO_DSR, state),
});

export default connect(
  mapStateToProps,
)(HeaderOptionsContainer);
