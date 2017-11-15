import React from 'react';
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
  isUserAFocalPoint,
  isUserAReviewer,
  isUserACreator,
} from '../../../../../store';
import ReviewContent from './reviewContent/reviewContent';
import Feedback from '../../../../applications/feedback/feedbackContainer';
import { APPLICATION_STATUSES } from '../../../../../helpers/constants';


const messages = {
  cn: 'Concept Note',
};

const ApplicationSummaryContent = (props) => {
  const { application,
    partnerDetails,
    partnerLoading,
    params: { applicationId },
    isUserFocalPoint,
    isUserReviewer,
    shouldSeeReviews,
    shouldAddFeedback,
  } = props;
  return (
    <GridColumn spacing="16">
      <Grid container direction="row">
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
      <Divider />
      {shouldSeeReviews && <ReviewContent
        applicationId={applicationId}
        isUserFocalPoint={isUserFocalPoint}
        isUserReviewer={isUserReviewer}
        justReason={application.justification_reason}
      />
      }
      <Feedback allowedToAdd={shouldAddFeedback} applicationId={applicationId} />
    </GridColumn>

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
  const partnerDetails = R.prop(R.prop('id', partner), state.agencyPartnerProfile);
  const cfeiCriteria = selectCfeiCriteria(state, eoi);
  const isUserFocalPoint = isUserAFocalPoint(state, eoi);
  const isUserReviewer = isUserAReviewer(state, eoi);
  const isUserCreator = isUserACreator(state, eoi);
  return {
    application,
    partner,
    partnerDetails,
    partnerLoading: state.partnerProfileDetails.detailsStatus.loading,
    cfeiCriteria,
    eoi,
    shouldAddFeedback: isUserFocalPoint || isUserCreator,
    shouldSeeReviews: (isUserFocalPoint || isUserReviewer)
    && status === APPLICATION_STATUSES.PRE
    && application_status === 'Application Under Review',
    isUserFocalPoint,
    isUserReviewer,
  };
};

export default connect(
  mapStateToProps,
)(ApplicationSummaryContent);
