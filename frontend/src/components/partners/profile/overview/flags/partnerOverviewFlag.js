import React from 'react';
import Grid from 'material-ui/Grid';
import R from 'ramda';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import HeaderList from '../../../../common/list/headerList';
import PaddedContent from '../../../../common/paddedContent';
import SpreadContent from '../../../../common/spreadContent';
import FlaggingStatus from '../../common/flaggingStatus';
import { checkPermission, AGENCY_PERMISSIONS } from '../../../../../helpers/permissions';

const messages = {
  flagStatus: 'Observations',
};

const flags = (flagItems = {}) => (
  <PaddedContent>
    <SpreadContent>
      <FlaggingStatus flags={flagItems} noFlagText />
    </SpreadContent>
  </PaddedContent>
);

const flagHeader = () => (
  <Grid container alignItems="center" justify="space-between" direction="row">
    <Grid item xs={12}>
      <Typography type="title" >{messages.flagStatus}</Typography>
    </Grid>
  </Grid>);

const PartnerOverviewFlag = (props) => {
  const { partner, hasPermissionViewFlagCount } = props;
  const flagItems = R.path(['partnerStatus', 'flagging_status'], partner);

  return (hasPermissionViewFlagCount && <HeaderList header={flagHeader(flagItems)}>
    {flags(flagItems)}
  </HeaderList>);
};

PartnerOverviewFlag.propTypes = {
  partner: PropTypes.object.isRequired,
  hasPermissionViewFlagCount: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  hasPermissionViewFlagCount:
    checkPermission(AGENCY_PERMISSIONS.VIEW_PROFILE_OBSERVATION_FLAG_COUNT, state),
});

export default connect(mapStateToProps)(PartnerOverviewFlag);
