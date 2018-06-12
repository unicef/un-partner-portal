import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import Tooltip from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';
import { PROJECT_TYPES, ROLES, PROJECT_STATUSES } from '../../../../helpers/constants';
import PartnerOpenHeaderOptions from './partnerOpenHeaderOptions';
import AgencyOpenHeaderOptions from './agencyOpenHeaderOptions';
import AgencyDirectHeaderOptions from './agencyDirectHeaderOptions';
import EoiStatusHeader from '../../cells/eoiStatusHeader';
import { selectCfeiStatus,
  isCfeiPublished,
  isCfeiCompleted,
  selectCfeiConverted,
  selectCfeiCompletedReasonDisplay,
  isUserAFocalPoint,
  isUserACreator,
} from '../../../../store';
import ConvertToDS from '../../buttons/convertToDirectSelection';
import PartnerUcnHeaderOptions from './partnerUcnHeaderOptions';

const messages = {
  infoDsr: 'This DS/R was sent to Advanced Editor for acceptance and publication',
  infoCfei: 'This CFEI was sent to Advanced Editor for acceptance and publication',
  infoUcn: 'This UCN was sent to Advanced Editor for acceptance and publication',
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
  } = props;
  let options;
  let status = <EoiStatusHeader status={cfeiStatus} />;

  if (type === PROJECT_TYPES.OPEN) {
    if (role === ROLES.AGENCY) {
      options = !cfeiCompleted ? <AgencyOpenHeaderOptions id={id} /> : null;
    } else if (role === ROLES.PARTNER) {
      options = <PartnerOpenHeaderOptions />;
    }
  } else if (type === PROJECT_TYPES.DIRECT && role === ROLES.AGENCY) {
    options = <AgencyDirectHeaderOptions id={id} />;
  } else if (type === PROJECT_TYPES.UNSOLICITED && role === ROLES.PARTNER) {
    if (cfeiStatus !== PROJECT_STATUSES.DRA) {
      status = null;
    }
    
    options = <PartnerUcnHeaderOptions id={id} />;
  }
  if (type === PROJECT_TYPES.UNSOLICITED && role === ROLES.AGENCY) {
    return !cfeiConverted ? <ConvertToDS partnerId={partnerId} id={id} /> : null;
  }

  if (cfeiStatus === 'Sen') {
    status = (<Tooltip
      title={tooltipInfo(type)}
      placement="center"
    >
      <div>
        <EoiStatusHeader status={cfeiStatus} />
        <Typography type="caption">{completedReasonDisplay}</Typography>
      </div>
    </Tooltip>);
  }

  return (
    <Grid container direction="row" alignItems="center" wrap="nowrap" spacing={24}>
      <Grid item>
        <div>
          {status}
          {completedReasonDisplay && <Typography type="caption">{completedReasonDisplay}</Typography>}
        </div></Grid>
      <Grid item>{options}</Grid>
    </Grid>
  );
};

HeaderOptionsContainer.propTypes = {
  role: PropTypes.string,
  type: PropTypes.string,
  cfeiCompleted: PropTypes.bool,
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
});

export default connect(
  mapStateToProps,
)(HeaderOptionsContainer);
