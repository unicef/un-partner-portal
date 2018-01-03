import React from 'react';
import Grid from 'material-ui/Grid';
import R from 'ramda';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import HeaderList from '../../../../common/list/headerList';
import PaddedContent from '../../../../common/paddedContent';
import SpreadContent from '../../../../common/spreadContent';
import PartnerOverviewFlagMenu from './partnerOverviewFlagMenu';
import { isUserAgencyReader } from '../../../../../helpers/authHelpers';
import FlagSummaryButton from '../../buttons/viewFlagsSummaryButton';
import FlaggingStatus from '../../common/flaggingStatus';

const messages = {
  flagStatus: 'Flag status',
  updated: 'Last updated: ',
  none: 'None',
};

const flags = (displayMenu, flagItems = {}) => (
  <PaddedContent>
    <SpreadContent>
      <FlaggingStatus flags={flagItems} noFlagText />
      {(flagItems.yellow > 0 || flagItems.red > 0 || flagItems.invalid > 0)
        && displayMenu
        && <FlagSummaryButton flagItems={flagItems} />}
    </SpreadContent>
  </PaddedContent>
);

const flagHeader = displayMenu => (
  <Grid container alignItems="center" justify="space-between" direction="row">
    <Grid item xs={10}>
      <Typography type="title" >{messages.flagStatus}</Typography>
    </Grid>
    <Grid item xs={2}>
      {displayMenu && <PartnerOverviewFlagMenu />}
    </Grid>
  </Grid>);

const PartnerOverviewFlag = (props) => {
  const { partner, displayMenu } = props;
  const flagItems = R.path(['partnerStatus', 'flagging_status'], partner);
  return (
    <div>
      <HeaderList
        header={flagHeader(displayMenu, flagItems)}
      >
        {flags(displayMenu, flagItems)}
      </HeaderList>
    </div>);
};


PartnerOverviewFlag.propTypes = {
  partner: PropTypes.object.isRequired,
  displayMenu: PropTypes.bool,
};

const mapStateToProps = state => ({
  displayMenu: !isUserAgencyReader(state),
});


export default connect(mapStateToProps)(PartnerOverviewFlag);
