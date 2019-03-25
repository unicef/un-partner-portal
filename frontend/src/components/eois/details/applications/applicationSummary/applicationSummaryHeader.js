import React, { Component } from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

import HeaderNavigation from '../../../../common/headerNavigation';
import {
  selectApplication,
  selectApplicationStatus,
  isUserAFocalPoint,
  isUserAReviewer,
  selectReview,
  selectAssessment,
  isCfeiCompleted,
  isCfeiDeadlinePassed,
  selectCfeiStatus,
  isUserACreator,
} from '../../../../../store';
import ApplicationStatusText from '../applicationStatusText';
import GridRow from '../../../../common/grid/gridRow';
import EditReviewModalButton from './reviewContent/editReviewModalButton';
import AddReviewModalButton from './reviewContent/addReviewModalButton';
import WithdrawApplicationButton from '../../../buttons/withdrawApplicationButton';
import { APPLICATION_STATUSES, PROJECT_STATUSES } from '../../../../../helpers/constants';
import { checkPermission, AGENCY_PERMISSIONS, isRoleOffice, AGENCY_ROLES } from '../../../../../helpers/permissions';

const messages = {
  header: 'Application from:',
  noCfei: 'Sorry but this application doesn\'t exist',
  retracted: 'Retracted',
};

class ApplicationSummaryHeader extends Component {
  constructor(props) {
    super(props);

    this.isAssessActionAllowed = this.isAssessActionAllowed.bind(this);
    this.isReatractAllowed = this.isReatractAllowed.bind(this);
  }

  isReatractAllowed() {
    const {
      hasRetractPermission,
      isAdvEd,
      isMFT,
      isCreator,
      isFocalPoint } = this.props;

    return ((hasRetractPermission && isAdvEd && (isCreator || isFocalPoint))
    || (hasRetractPermission && isMFT && isFocalPoint));
  }

  isAssessActionAllowed(hasActionPermission) {
    const {
      isAdvEd,
      isPAM,
      isBasEd,
      isMFT,
      isReviewer,
      isCreator,
      isFocalPoint } = this.props;

    return ((hasActionPermission && isAdvEd && isReviewer)
    || (hasActionPermission && isBasEd && isReviewer)
    || (hasActionPermission && isMFT && isFocalPoint)
    || (hasActionPermission && isPAM && isCreator));
  }
  renderActionButton() {
    const { loading,
      reviews,
      user,
      status,
      getAssessment,
      params: { applicationId },
      didWin,
      didWithdraw,
      hasAssessPermission,
      isCompleted,
      isDeadlinePassed,
      cfeiStatus,
    } = this.props;
    const disabled = loading
    || status !== APPLICATION_STATUSES.PRE
    || cfeiStatus !== PROJECT_STATUSES.CLO;

    if (loading || isCompleted || status !== APPLICATION_STATUSES.PRE) return <div />;
    const assessment = getAssessment(reviews && reviews[user]);

    if (assessment && assessment.completed) {
      if (didWin) {
        if (didWithdraw) {
          return <Button disabled>{messages.retracted}</Button>;
        }
        return (this.isReatractAllowed() && <WithdrawApplicationButton
          raised
          applicationId={applicationId}
        />);
      }
    } else if (hasAssessPermission) {
      if (R.prop(user, reviews) && this.isAssessActionAllowed(hasAssessPermission)) {
        const assessment = getAssessment(reviews[user]);

        return (!assessment.completed ?
          <EditReviewModalButton
            assessmentId={reviews[user]}
            scores={getAssessment(reviews[user])}
            reviewer={`${user}`}
            disabled={disabled}
          />
          : null);
      } else if (this.isAssessActionAllowed(hasAssessPermission) && isDeadlinePassed) {
        return (<AddReviewModalButton
          raised
          reviewer={`${user}`}
        />);
      }
    }
    return <div />;
  }

  renderContent() {
    const {
      partner,
      status,
      applicationStatus,
      children,
      error,
      params: { id },
    } = this.props;
    if (error.notFound) {
      return <Typography >{messages.noApplication}</Typography>;
    } else if (error.message) {
      return <Typography >{error.message}</Typography>;
    }

    return (<HeaderNavigation
      title={`${messages.header} ${partner}`}
      header={<GridRow alignItems="center">
        {status && <ApplicationStatusText status={status} applicationStatus={applicationStatus} />}
        {this.renderActionButton()}
      </GridRow>
      }
      backButton
      defaultReturn={`/cfei/open/${id}/preselected`}
    >
      {children}
    </HeaderNavigation>);
  }

  render() {
    return (
      <Grid item>
        {this.renderContent()}
      </Grid>
    );
  }
}

ApplicationSummaryHeader.propTypes = {
  partner: PropTypes.string,
  status: PropTypes.string,
  children: PropTypes.node,
  params: PropTypes.object,
  error: PropTypes.object,
  loading: PropTypes.bool,
  user: PropTypes.number,
  isFocalPoint: PropTypes.bool,
  isReviewer: PropTypes.bool,
  isCreator: PropTypes.bool,
  reviews: PropTypes.object,
  getAssessment: PropTypes.func,
  hasAssessPermission: PropTypes.bool,
  hasRetractPermission: PropTypes.bool, 
  didWin: PropTypes.bool,
  didWithdraw: PropTypes.bool, 
  cfeiStatus: PropTypes.string,
  applicationStatus: PropTypes.string,
  isAdvEd: PropTypes.bool,
  isMFT: PropTypes.bool,
  isPAM: PropTypes.bool,
  isBasEd: PropTypes.bool,
  isCompleted: PropTypes.bool,
  isDeadlinePassed: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
  const application = selectApplication(state, ownProps.params.applicationId) || {};
  const reviews = selectReview(state, ownProps.params.applicationId) || {};
  const { eoi,
    did_win,
    did_withdraw,
    assessments_is_completed = false,
    application_status,
    partner: {
      legal_name,
      partner_additional: {
        flagging_status: {
          red: redFlags = 0,
        } = {},
        is_verified: isVerified,
      } = {},
    } = {},
  } = application;
  return {
    isAdvEd: isRoleOffice(AGENCY_ROLES.EDITOR_ADVANCED, state),
    isMFT: isRoleOffice(AGENCY_ROLES.MFT_USER, state),
    isPAM: isRoleOffice(AGENCY_ROLES.PAM_USER, state),
    isBasEd: isRoleOffice(AGENCY_ROLES.EDITOR_BASIC, state),
    status: selectApplicationStatus(state, ownProps.params.applicationId),
    applicationStatus: application_status,
    partner: legal_name,
    getAssessment: id => selectAssessment(state, id),
    loading: state.applicationDetails.status.loading,
    error: state.applicationDetails.status.error,
    isFocalPoint: isUserAFocalPoint(state, eoi),
    isCreator: isUserACreator(state, eoi),
    cfeiStatus: selectCfeiStatus(state, eoi),
    isReviewer: isUserAReviewer(state, eoi),
    hasAssessPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_REVIEW_APPLICATIONS, state),
    hasRetractPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_DESELECT_PARTNER, state),
    reviews,
    user: state.session.userId,
    didWin: did_win,
    didWithdraw: did_withdraw,
    isCompleted: isCfeiCompleted(state, eoi),
    isDeadlinePassed: isCfeiDeadlinePassed(state, eoi),
  };
};

export default R.compose(
  withRouter,
  connect(mapStateToProps),
)(ApplicationSummaryHeader);

