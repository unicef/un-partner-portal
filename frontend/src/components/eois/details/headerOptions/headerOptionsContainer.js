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
import EoiStatusCell from '../../cells/eoiStatusCell';
import { selectCfeiStatus,
  isCfeiPublished,
  isCfeiCompleted,
  selectCfeiConverted,
  selectCfeiCompletedReasonDisplay,
  isUserAFocalPoint,
  isUserACreator,
} from '../../../../store';
import GridColumn from '../../../common/grid/gridColumn';
import ConvertToDS from '../../buttons/convertToDirectSelection';

const HeaderOptionsContainer = (props) => {
  const { role,
    type,
    cfeiCompleted,
    cfeiStatus,
    cfeiConverted,
    id,
    partnerId,
    completedReasonDisplay,
    allowedToEdit,
  } = props;
  let options;
  if (type === PROJECT_TYPES.OPEN) {
    if (role === ROLES.AGENCY) {
      options = !cfeiCompleted ? <AgencyOpenHeaderOptions id={id} /> : null;
    } else if (role === ROLES.PARTNER) {
      options = <PartnerOpenHeaderOptions />;
    }
  } else if (type === PROJECT_TYPES.DIRECT && role === ROLES.AGENCY) {
    options = !cfeiCompleted ? <AgencyDirectHeaderOptions id={id} /> : null;
  }
  if (type === PROJECT_TYPES.UNSOLICITED) {
    return !cfeiConverted && role === ROLES.AGENCY
      ? <ConvertToDS partnerId={partnerId} id={id} />
      : null;
  }
  if (cfeiCompleted) {
    return (
      <GridColumn spacing={0} justify="flex-end" alignItems="flex-end">
        <EoiStatusCell status={cfeiStatus} />
        <Typography type="caption">{completedReasonDisplay}</Typography>
      </GridColumn>);
  } else if (cfeiStatus === 'Sen') {
    return (
      <GridColumn spacing={0} justify="flex-end" alignItems="flex-end">
        <Tooltip
          title="This DS/R was sent to Advanced Editor for acceptance and publication"
          placement="center"
        >
          <div>
            <EoiStatusCell status={cfeiStatus} />
            <Typography type="caption">{completedReasonDisplay}</Typography>
          </div>
        </Tooltip>
      </GridColumn>);
  }

  return (
    <Grid container direction="row" alignItems="center" wrap="nowrap" spacing={24}>
      {cfeiStatus && <Grid item><EoiStatusCell status={cfeiStatus} /></Grid>}
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
  allowedToEdit: PropTypes.bool,
  completedReasonDisplay: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  cfeiCompleted: isCfeiCompleted(state, ownProps.id),
  cfeiPublished: isCfeiPublished(state, ownProps.id),
  cfeiStatus: selectCfeiStatus(state, ownProps.id),
  completedReasonDisplay: selectCfeiCompletedReasonDisplay(state, ownProps.id),
  cfeiConverted: selectCfeiConverted(state, ownProps.id),
  allowedToEdit: isUserAFocalPoint(state, ownProps.id) || isUserACreator(state, ownProps.id),
});

export default connect(
  mapStateToProps,
)(HeaderOptionsContainer);
