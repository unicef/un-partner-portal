import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import R from 'ramda';
import { connect } from 'react-redux';
import Divider from 'material-ui/Divider';
import GridColumn from '../../../../common/grid/gridColumn';
import PartnerOverview from '../../../../partners/profile/overview/partnerOverviewSummary';
import ConceptNote from '../../overview/conceptNote';
import {
  selectApplication,
  selectCfeiCriteria,
} from '../../../../../store';
import ReviewContentContainer from './reviewContent/reviewContentContainer';


const messages = {
  cn: 'Concept Note',
};

const ApplicationSummaryContent = (props) => {
  const { application, partnerDetails, partnerLoading, params: { applicationId } } = props;
  return (
    <GridColumn spacing="8">
      <Grid container direction="row">
        <Grid item xs={12} sm={8}>
          <PartnerOverview partner={partnerDetails} loading={partnerLoading} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ConceptNote
            conceptNote={application.details}
            loading={partnerLoading}
            date={application.created}
            title={messages.cn}
          />
        </Grid>
      </Grid>
      <Divider />
      <ReviewContentContainer applicationId={applicationId} />
    </GridColumn>

  );
};


ApplicationSummaryContent.propTypes = {
  application: PropTypes.object,
  partnerDetails: PropTypes.object,
  partnerLoading: PropTypes.bool,
  params: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  const application = selectApplication(state, ownProps.params.applicationId) || {};
  const { partner, eoi } = application;
  const partnerDetails = R.prop(partner, state.agencyPartnerProfile);
  const cfeiCriteria = selectCfeiCriteria(state, eoi);
  return {
    application,
    partner,
    partnerDetails,
    partnerLoading: state.partnerProfileDetails.detailsStatus.loading,
    cfeiCriteria,
    eoi,
  };
};

export default connect(
  mapStateToProps,
)(ApplicationSummaryContent);
