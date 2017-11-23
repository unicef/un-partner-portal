import React, { Component } from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import Tooltip from 'material-ui/Tooltip';
import Grid from 'material-ui/Grid';
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
} from '../../../../../store';
import ApplicationStatusText from '../applicationStatusText';
import GridRow from '../../../../common/grid/gridRow';
import EditReviewModalButton from './reviewContent/editReviewModalButton';
import AddReviewModalButton from './reviewContent/addReviewModalButton';
import AwardApplicationButton from '../../../buttons/awardApplicationButton';
import WithdrawApplicationButton from '../../../buttons/withdrawApplicationButton';
import { APPLICATION_STATUSES } from '../../../../../helpers/constants';

const messages = {
  header: 'Application from :',
  noCfei: 'Sorry but this application doesn\'t exist',
  button: 'Award',
  tooltip: {
    notVerified: 'Partner is not verified',
    notPreselected: 'Application is not preselected',
    redFlag: 'Partner has red flag',
    noReviews: 'All assessments are not done yet',
  },
};

const concatText = (text, message) => `${text}${message} \n`;

class ApplicationSummaryHeader extends Component {
  constructor() {
    super();
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  handleBackButton() {
    const { params: { type, id } } = this.props;
    history.push(`/cfei/${type}/${id}/applications`);
  }

  renderTooltipText() {
    const {
      status,
      isVerified,
      redFlags,
      completedReview,
    } = this.props;
    let text = '';
    if (status !== APPLICATION_STATUSES.PRE) {
      text = concatText(text, messages.tooltip.notPreselected);
    }
    if (!isVerified) text = concatText(text, messages.tooltip.notVerified);
    if (redFlags) text = concatText(text, messages.tooltip.redFlag);
    if (!completedReview) text = concatText(text, messages.tooltip.noReviews);
    return text;
  }

  renderActionButton() {
    const { loading,
      isUserFocalPoint,
      isUserReviewer,
      reviews,
      user,
      status,
      getAssessment,
      params: { applicationId },
      didWin,
      isVerified,
      redFlags,
      completedReview,
      isCfeiCompleted,
    } = this.props;
    const disableAward = loading
      || status !== APPLICATION_STATUSES.PRE
      || !isVerified
      || redFlags
      || !completedReview;
    const disabled = loading || status !== APPLICATION_STATUSES.PRE;
    if (isCfeiCompleted) return <div />;
    if (isUserFocalPoint) {
      if (didWin) {
        return (<WithdrawApplicationButton
          disabled={disabled}
          raised
          applicationId={applicationId}
        />);
      }
      return (
        <Tooltip
          style={{ whiteSpace: 'pre-line' }}
          disableTriggerFocus={!disableAward}
          disableTriggerHover={!disableAward}
          disableTriggerTouch={!disableAward}
          id="tooltip-award-button"
          title={this.renderTooltipText()}
          placement="bottom"
        >
          <div>
            <AwardApplicationButton
              disabled={disableAward}
              applicationId={applicationId}
            />
          </div>
        </Tooltip>);
    } else if (isUserReviewer) {
      if (R.prop(user, reviews)) {
        return (<EditReviewModalButton
          assessmentId={reviews[user]}
          scores={getAssessment(reviews[user])}
          reviewer={user}
          disabled={disabled}
        />);
      }
      return (<AddReviewModalButton
        raised
        reviewer={user}
        disabled={disabled}
      />);
    }
    return <div />;
  }

  renderContent() {
    const {
      partner,
      status,
      children,
      params: { type },
      error,
    } = this.props;
    if (error.notFound) {
      return <Typography >{messages.noApplication}</Typography>;
    } else if (error.message) {
      return <Typography >{error.message}</Typography>;
    }
    return (<HeaderNavigation
      title={`${messages.header} ${partner}`}
      header={<GridRow alignItems="center">
        <ApplicationStatusText status={status} />
        {this.renderActionButton()}
      </GridRow>
      }
      backButton
      handleBackButton={this.handleBackButton}
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
  isUserFocalPoint: PropTypes.bool,
  isUserReviewer: PropTypes.bool,
  reviews: PropTypes.object,
  getAssessment: PropTypes.func,
  didWin: PropTypes.bool,
  isVerified: PropTypes.bool,
  redFlags: PropTypes.number,
  completedReview: PropTypes.bool,
  isCfeiCompleted: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
  const application = selectApplication(state, ownProps.params.applicationId) || {};
  const reviews = selectReview(state, ownProps.params.applicationId) || {};
  const { eoi,
    did_win,
    did_withdraw,
    assessments_is_completed = false,
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
    status: selectApplicationStatus(state, ownProps.params.applicationId),
    partner: legal_name,
    getAssessment: id => selectAssessment(state, id),
    loading: state.applicationDetails.status.loading,
    error: state.applicationDetails.status.error,
    isUserFocalPoint: isUserAFocalPoint(state, eoi),
    isUserReviewer: isUserAReviewer(state, eoi),
    reviews,
    user: state.session.userId,
    didWin: did_win,
    didWithdraw: did_withdraw,
    isVerified,
    redFlags,
    completedReview: assessments_is_completed,
    isCfeiCompleted: isCfeiCompleted(state, eoi),
  };
};

const containerApplicationSummaryHeader = connect(
  mapStateToProps,
)(ApplicationSummaryHeader);

export default containerApplicationSummaryHeader;
