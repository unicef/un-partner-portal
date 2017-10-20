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
    } = this.props;
    if (isUserFocalPoint) {
      return (
        <Button disabled={loading} raised color="accent">{messages.button}</Button>);
    } else if (isUserReviewer) {
      if (R.has(user, reviews)) {
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
};

const mapStateToProps = (state, ownProps) => {
  const application = selectApplication(state, ownProps.params.applicationId) || {};
  const reviews = selectReview(state, ownProps.params.applicationId) || {};
  const { eoi } = application;
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
  };
};

const containerApplicationSummaryHeader = connect(
  mapStateToProps,
)(ApplicationSummaryHeader);

export default containerApplicationSummaryHeader;
