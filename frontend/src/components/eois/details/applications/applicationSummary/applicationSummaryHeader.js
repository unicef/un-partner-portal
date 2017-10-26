import React, { Component } from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import HeaderNavigation from '../../../../common/headerNavigation';
import {
  selectApplication,
  selectApplicationStatus,
  selectApplicationPartnerName,
  isUserAFocalPoint,
  isUserAReviewer,
  selectReview,
  selectAssessment,
} from '../../../../../store';
import ApplicationStatusText from '../applicationStatusText';
import GridRow from '../../../../common/grid/gridRow';
import EditReviewModalButton from './reviewContent/editReviewModalButton';
import AddReviewModalButton from './reviewContent/addReviewModalButton';
import AwardApplicationButton from '../../../buttons/awardApplicationButton';
import WithdrawApplicationButton from '../../../buttons/withdrawApplicationButton';

const messages = {
  header: 'Application from :',
  noCfei: 'Sorry but this application doesn\'t exist',
  button: 'Award',
};

class ApplicationSummaryHeader extends Component {
  constructor() {
    super();
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  handleBackButton() {
    const { params: { type, id } } = this.props;
    history.push(`/cfei/${type}/${id}/applications`);
  }

  renderActionButton() {
    const { loading,
      isUserFocalPoint,
      isUserReviewer,
      reviews,
      user,
      getAssessment,
      params: { applicationId },
      didWin,
    } = this.props;
    if (isUserFocalPoint) {
      if (didWin) {
        return <WithdrawApplicationButton disabled={loading} applicationId={applicationId} />;
      }
      return <AwardApplicationButton disabled={loading} applicationId={applicationId} />;
    } else if (isUserReviewer) {
      if (R.prop(user, reviews)) {
        return (<EditReviewModalButton
          assessmentId={reviews[user]}
          scores={getAssessment(reviews[user])}
          reviewer={user}
          disabled={loading}
        />);
      }
      return (<AddReviewModalButton raised reviewer={user} disabled={loading} />);
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
      header={<GridRow align="center">
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
};

const mapStateToProps = (state, ownProps) => {
  const application = selectApplication(state, ownProps.params.applicationId) || {};
  const reviews = selectReview(state, ownProps.params.applicationId) || {};
  const { eoi, did_win, did_withdraw } = application;
  return {
    status: selectApplicationStatus(state, ownProps.params.applicationId),
    partner: selectApplicationPartnerName(state, ownProps.params.applicationId),
    getAssessment: id => selectAssessment(state, id),
    loading: state.applicationDetails.status.loading,
    error: state.applicationDetails.status.error,
    isUserFocalPoint: isUserAFocalPoint(state, eoi),
    isUserReviewer: isUserAReviewer(state, eoi),
    reviews,
    user: state.session.userId,
    didWin: did_win,
    didWithdraw: did_withdraw,
  };
};

const containerApplicationSummaryHeader = connect(
  mapStateToProps,
)(ApplicationSummaryHeader);

export default containerApplicationSummaryHeader;
