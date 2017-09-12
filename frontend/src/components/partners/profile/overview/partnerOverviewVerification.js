import React from 'react';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import GridColumn from '../../../common/grid/gridColumn';
import HeaderList from '../../../common/list/headerList';
import PaddedContent from '../../../common/paddedContent';
import PartnerOverviewVerificationMenu from './partnerOverviewVerificationMenu';

const messages = {
  verificationStatus: 'Verification status',
};

const fields = () => (
  <PaddedContent>
    <GridColumn />
  </PaddedContent>
);

const summaryHeader = () => (
  <Grid container align="center" direction="row">
    <Grid item xs={10}>
      <Typography type="title" >{messages.verificationStatus}</Typography>
    </Grid>
    <Grid item xs={2}>
      <PartnerOverviewVerificationMenu />
    </Grid>
  </Grid>);

const PartnerOverviewVerification = (props) => {
  const { verificationItems } = props;
  return (
    <div>
      <HeaderList
        headerObject={summaryHeader()}
        rows={verificationItems ? [fields()] : []}
      />
    </div>);
};

PartnerOverviewVerification.propTypes = {
  verificationItems: PropTypes.array.isRequired,
};

export default PartnerOverviewVerification;
