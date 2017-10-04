import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import R from 'ramda';
import { connect } from 'react-redux';
import Divider from 'material-ui/Divider';
import GridColumn from '../../../../common/grid/gridColumn';
import PartnerOverview from '../../../../partners/profile/overview/partnerOverviewSummary';
import {
  selectApplication,
} from '../../../../../store';
import {
  loadPartnerDetails,
} from '../../../../../reducers/partnerProfileDetails';

class ApplicationSummaryContent extends Component {
  componentWillUpdate(nextProps) {
    if (!this.props.partner && nextProps.partner) {
      this.props.dispatch(loadPartnerDetails(nextProps.partner));
    }
  }

  render() {
    const { partnerDetails, partnerLoading } = this.props;
    return (
      <GridColumn >
        <Grid container direction="row">
          <Grid item xs={12} sm={8}>
            <PartnerOverview partner={partnerDetails} loading={partnerLoading} />
          </Grid>
          <Grid item xs={12} sm={4}>
          </Grid>
        </Grid>
        <Divider />
      </GridColumn>

    );
  }
}

ApplicationSummaryContent.propTypes = {
  params: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  const application = selectApplication(state, ownProps.params.applicationId) || {};
  const { partner } = application;
  const partnerDetails = R.prop(partner, state.agencyPartnerProfile);
  return {
    application,
    partner,
    partnerDetails,
    partnerLoading: state.partnerProfileDetails.detailsStatus.loading,
  };
};

export default connect(
  mapStateToProps,
)(ApplicationSummaryContent);
