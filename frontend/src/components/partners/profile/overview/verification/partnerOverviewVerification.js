import React from 'react';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import HeaderList from '../../../../common/list/headerList';
import PartnerOverviewVerificationMenu from './partnerOverviewVerificationMenu';
import { AGENCY_MEMBERS_POSITIONS } from '../../../../../helpers/constants';
import VerificationContent from './verificationContent';

const messages = {
  verificationStatus: 'Verification status',
};

const fields = partnerId => (
  <VerificationContent partnerId={partnerId} />
);

const summaryHeader = menuVisible => (
  <Grid container align="center" direction="row">
    <Grid item xs={10}>
      <Typography type="title" >{messages.verificationStatus}</Typography>
    </Grid>
    <Grid item xs={2}>
      {menuVisible && <PartnerOverviewVerificationMenu />}
    </Grid>
  </Grid>);

const PartnerOverviewVerification = (props) => {
  const { menuVisible, partnerId } = props;
  return (
    <div>
      <HeaderList
        header={summaryHeader(menuVisible)}
        rows={[fields(partnerId)]}
      />
    </div>);
};

PartnerOverviewVerification.propTypes = {
  menuVisible: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  menuVisible: state.session.position !== AGENCY_MEMBERS_POSITIONS.READER,
});

export default connect(mapStateToProps)(PartnerOverviewVerification);
