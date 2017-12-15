import React from 'react';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import R from 'ramda';
import { connect } from 'react-redux';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';
import GridColumn from '../../../../common/grid/gridColumn';
import PartnerOverview from '../../../../partners/profile/overview/partnerOverviewSummary';
import ConceptNote from '../../overview/conceptNote';
import {
  selectApplication,
  selectCfeiCriteria,
  selectCfeiStatus,
  isUserAFocalPoint,
  isUserAReviewer,
  isUserACreator,
} from '../../../../../store';
import ReviewContent from './reviewContent/reviewContent';
import Feedback from '../../../../applications/feedback/feedbackContainer';
import { APPLICATION_STATUSES, PROJECT_STATUSES } from '../../../../../helpers/constants';


const messages = {
  cn: 'Concept Note',
};

const styleSheet = () => ({
  grid: {
    display: 'flex',
    flexDirection: 'column',
    margin: -12,
  },
  gridItem: {
    padding: 12,
  },
});


const ApplicationSummaryContent = (props) => {
  const { application,
    partnerDetails,
    partnerLoading,
    params: { applicationId },
    isUserFocalPoint,
    isUserReviewer,
    shouldSeeReviews,
    shouldAddFeedback,
    classes,
  } = props;
  return (
    <div className={classes.grid}>
      <Grid item className={classes.gridItem}>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={8}>
            <PartnerOverview partner={partnerDetails} loading={partnerLoading} button />
          </Grid>
          <Grid item xs={12} sm={4}>
            <ConceptNote
              conceptNote={application.cn}
              loading={partnerLoading}
              date={application.created}
              title={messages.cn}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item className={classes.gridItem}>
        <Divider />
      </Grid>
      {shouldSeeReviews ? <Grid item className={classes.gridItem}>
        <ReviewContent
          applicationId={applicationId}
          isUserFocalPoint={isUserFocalPoint}
          isUserReviewer={isUserReviewer}
          justReason={application.justification_reason}
        />
      </Grid>
        : null
      }
      <Grid item className={classes.gridItem}>
        <Feedback allowedToAdd={shouldAddFeedback} applicationId={applicationId} />
      </Grid>
    </div>

  );
};


ApplicationSummaryContent.propTypes = {
  application: PropTypes.object,
  partnerDetails: PropTypes.object,
  partnerLoading: PropTypes.bool,
  params: PropTypes.object,
  shouldSeeReviews: PropTypes.bool,
  isUserFocalPoint: PropTypes.bool,
  isUserReviewer: PropTypes.bool,
  shouldAddFeedback: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
  const application = selectApplication(state, ownProps.params.applicationId) || {};
  const { partner = {}, eoi, status, application_status } = application;
  const partnerDetails = R.prop(R.prop('id', partner), state.agencyPartnerProfile.data);
  const cfeiCriteria = selectCfeiCriteria(state, eoi);
  const cfeiStatus = selectCfeiStatus(state, eoi);
  const isUserFocalPoint = isUserAFocalPoint(state, eoi);
  const isUserReviewer = isUserAReviewer(state, eoi);
  const isUserCreator = isUserACreator(state, eoi);
  return {
    application,
    partner,
    partnerDetails,
    partnerLoading: state.agencyPartnerProfile.status.loading,
    cfeiCriteria,
    eoi,
    shouldAddFeedback: isUserFocalPoint || isUserCreator,
    shouldSeeReviews: (isUserFocalPoint || isUserReviewer)
    && status === APPLICATION_STATUSES.PRE
    && cfeiStatus === PROJECT_STATUSES.CLO,
    isUserFocalPoint,
    isUserReviewer,
  };
};

export default connect(
  mapStateToProps,
)(withStyles(styleSheet)(ApplicationSummaryContent));
