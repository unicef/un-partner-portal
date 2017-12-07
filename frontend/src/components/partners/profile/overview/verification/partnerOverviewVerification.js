import React from 'react';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import HeaderList from '../../../../common/list/headerList';
import PartnerOverviewVerificationMenu from './partnerOverviewVerificationMenu';
import { isUserAgencyReader } from '../../../../../helpers/authHelpers';
import VerificationContent from './verificationContent';

const messages = {
  verificationStatus: 'Verification status',
};

const fields = partnerId => (
  <VerificationContent partnerId={partnerId} />
);

const summaryHeader = menuVisible => (
  <Grid container alignItems="center" direction="row">
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
      >
        {fields(partnerId)}
      </HeaderList>
    </div>);
};

PartnerOverviewVerification.propTypes = {
  menuVisible: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  menuVisible: !isUserAgencyReader(state),
});

export default connect(mapStateToProps)(PartnerOverviewVerification);
