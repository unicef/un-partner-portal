import React from 'react';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GridColumn from '../../../../common/grid/gridColumn';
import PartnerOverviewSummary from '../partnerOverviewSummary';
import PartnerUnDataDetails from './partnerUnDataDetails';

const PartnerOverview = (props) => {
  const { partner, params: { id } } = props;

  return (
    <Grid container direction="row" spacing={24}>
      <Grid item xs={12} sm={8}>
        <PartnerOverviewSummary partner={partner} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <GridColumn>
          <PartnerUnDataDetails partnerId={id} />
        </GridColumn>
      </Grid>
    </Grid>);
};

PartnerOverview.propTypes = {
  partner: PropTypes.object.isRequired,
  params: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  partner: state.agencyPartnerProfile.data[ownProps.params.id] || {},
});


export default connect(mapStateToProps)(PartnerOverview);
