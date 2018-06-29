import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import FlagIcon from '../icons/flagIcon';
import EscalatedIcon from '../icons/escalatedIcon';
import ObservationIcon from '../icons/observationIcon';
import { FLAGS } from '../../../../helpers/constants';
import { checkPermission, AGENCY_PERMISSIONS } from '../../../../helpers/permissions';

const FlaggingStatus = (props) => {
  const { flags: { escalated, yellow, observation }, hasPermissionViewFlagCount } = props;

  return (hasPermissionViewFlagCount && <Grid container spacing={0}>
    {observation >= 0 && ([
      <Grid item key={0}>
        <Typography>
          {observation}
        </Typography>
      </Grid>,
      <Grid item key={1}>
        <ObservationIcon />
      </Grid>,
    ])}
    {yellow >= 0 && ([
      <Grid item key={0}>
        <Typography>
          {observation}
        </Typography>
      </Grid>,
      <Grid item key={1}>
        <FlagIcon color={FLAGS.YELLOW} />
      </Grid>,
    ])}
    {escalated >= 0 && ([
      <Grid item key={0}>
        <Typography>
          {escalated}
        </Typography>
      </Grid>,
      <Grid item key={1}>
        <EscalatedIcon />
      </Grid>,
    ])}
  </Grid>);
};

FlaggingStatus.propTypes = {
  hasPermissionViewFlagCount: PropTypes.bool,
  flags: PropTypes.object,
};

const mapStateToProps = state => ({
  hasPermissionViewFlagCount:
    checkPermission(AGENCY_PERMISSIONS.VIEW_PROFILE_OBSERVATION_FLAG_COUNT, state),
});

export default connect(mapStateToProps)(FlaggingStatus);
