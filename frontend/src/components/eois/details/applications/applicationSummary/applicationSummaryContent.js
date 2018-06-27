import React from 'react';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import R from 'ramda';
import { connect } from 'react-redux';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';
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
import { isRoleOffice, checkPermission, AGENCY_PERMISSIONS, AGENCY_ROLES } from '../../../../../helpers/permissions';


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

const isViewFeedbackAllowed = (hasActionPermission, isAdvEd, isPAM, isBasEd, isCreator, isFocalPoint) =>
  ((hasActionPermission && isAdvEd && (isCreator || isFocalPoint))
    || (hasActionPermission && isBasEd && isCreator)
    || (hasActionPermission && isPAM && isCreator));

const isViewAssessmentsAllowed = (hasActionPermission, isAdvEd, isPAM, isBasEd,
  isMFT, isReviewer, isCreator, isFocalPoint) =>
  ((hasActionPermission && isAdvEd && (isCreator || isFocalPoint || isReviewer))
    || (hasActionPermission && isBasEd && (isCreator || isReviewer))
    || (hasActionPermission && isMFT && isFocalPoint)
    || (hasActionPermission && isPAM && isCreator));

const ApplicationSummaryContent = (props) => {
  const { application,
    partnerDetails,
    partnerLoading,
    params: { applicationId },
    isFocalPoint,
    isCreator,
    isReviewer,
    hasViewAssessmentsPermission,
    cfeiStatus,
    status,
    isPAM,
    isMFT,
    isAdvEd,
    isBasEd,
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
      {(isViewAssessmentsAllowed(hasViewAssessmentsPermission, isAdvEd, isPAM, isBasEd, isMFT, isReviewer, isCreator, isFocalPoint)
      && status === APPLICATION_STATUSES.PRE && cfeiStatus === PROJECT_STATUSES.CLO)
        ? <Grid item className={classes.gridItem}>
          <ReviewContent
            applicationId={applicationId}
            isUserFocalPoint={isFocalPoint}
            isUserCreator={isCreator}
            isUserReviewer={isReviewer}
            justReason={application.justification_reason}
          />
        </Grid>
        : null
      }
      <Grid item className={classes.gridItem}>
        {isViewFeedbackAllowed(hasViewAssessmentsPermission, isAdvEd, isPAM, isBasEd, isCreator, isFocalPoint)
          && <Feedback allowedToAdd applicationId={applicationId} />}
      </Grid>
    </div>

  );
};


ApplicationSummaryContent.propTypes = {
  classes: PropTypes.object,
  application: PropTypes.object,
  partnerDetails: PropTypes.object,
  partnerLoading: PropTypes.bool,
  params: PropTypes.object,
  status: PropTypes.string,
  cfeiStatus: PropTypes.string,
  hasViewAssessmentsPermission: PropTypes.bool,
  isFocalPoint: PropTypes.bool,
  isReviewer: PropTypes.bool,
  isCreator: PropTypes.bool,
  isAdvEd: PropTypes.bool,
  isMFT: PropTypes.bool,
  isPAM: PropTypes.bool,
  isBasEd: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
  const application = selectApplication(state, ownProps.params.applicationId) || {};
  const { partner = {}, eoi, status } = application;
  const partnerDetails = R.prop(R.prop('id', partner), state.agencyPartnerProfile.data);
  const cfeiCriteria = selectCfeiCriteria(state, eoi);
  const cfeiStatus = selectCfeiStatus(state, eoi);
  return {
    isAdvEd: isRoleOffice(AGENCY_ROLES.EDITOR_ADVANCED, state),
    isMFT: isRoleOffice(AGENCY_ROLES.MFT_USER, state),
    isPAM: isRoleOffice(AGENCY_ROLES.PAM_USER, state),
    isBasEd: isRoleOffice(AGENCY_ROLES.EDITOR_BASIC, state),
    isFocalPoint: isUserAFocalPoint(state, eoi),
    isCreator: isUserACreator(state, eoi),
    cfeiStatus: selectCfeiStatus(state, eoi),
    isReviewer: isUserAReviewer(state, eoi),
    hasViewAssessmentsPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_VIEW_ALL_REVIEWS, state),
    hasFeedbackPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_PUBLISHED_VIEW_AND_ANSWER_CLARIFICATION_QUESTIONS, state),
    application,
    partner,
    partnerDetails,
    partnerLoading: state.agencyPartnerProfile.status.loading,
    cfeiCriteria,
    status,
    eoi,
  };
};

export default connect(
  mapStateToProps,
)(withStyles(styleSheet)(ApplicationSummaryContent));
