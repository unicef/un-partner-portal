import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty, equals } from 'ramda';
import Typography from 'material-ui/Typography';
import PaddedContent from '../../../../../common/paddedContent';
import EmptyContent from '../../../../../common/emptyContent';
import HeaderList from '../../../../../common/list/headerList';
import {
  isUserAFocalPoint,
  selectCfeiReviewers,
  selectCfeiDetails,
  isCfeiCompleted,
  isUserACreator,
  isCfeiDeadlinePassed,
} from '../../../../../../store';
import { loadReviewers } from '../../../../../../reducers/cfeiReviewers';
import SingleReviewer from './singleReviewer';

const messages = {
  title: 'Reviewers',
  empty: 'No Reviewers added yet',
};

class ReviewersSummary extends Component {
  componentDidMount() {
    this.props.getReviewers();
  }

  componentWillReceiveProps({ cfeiReviewers }) {
    if (!equals(cfeiReviewers, this.props.cfeiReviewers)) {
      this.props.getReviewers();
    }
  }

  content() {
    const { cfeiCompleted, loading, reviewers, focalPoint } = this.props;
    if (loading) {
      return <EmptyContent />;
    } else if (!reviewers || isEmpty(reviewers)) {
      return (<PaddedContent>
        <Typography>
          {messages.empty}
        </Typography>
      </PaddedContent>);
    }
    return (
      <div>
        {reviewers.map(reviewer => (<SingleReviewer
          key={reviewer.user_id}
          reviewer={reviewer}
          isFocalPoint={focalPoint}
          cfeiCompleted={cfeiCompleted}
        />))}
      </div>);
  }


  render() {
    const { deadlinePassed, loading } = this.props;
    return (
      deadlinePassed
        ? <HeaderList
          loading={loading}
          header={<Typography style={{ margin: 'auto 0' }} type="headline" >{messages.title}</Typography>}
        >
          {this.content()}
        </HeaderList>
        : null
    );
  }
}

ReviewersSummary.propTypes = {
  reviewers: PropTypes.array,
  cfeiReviewers: PropTypes.array,
  focalPoint: PropTypes.bool,
  getReviewers: PropTypes.func,
  loading: PropTypes.bool,
  cfeiCompleted: PropTypes.bool,
  deadlinePassed: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id);

  return {
    focalPoint: isUserAFocalPoint(state, ownProps.id) || isUserACreator(state, ownProps.id),
    reviewers: selectCfeiReviewers(state, ownProps.id),
    cfeiReviewers: cfei ? cfei.reviewers : [],
    loading: state.cfeiReviewers.status.loading,
    cfeiCompleted: isCfeiCompleted(state, ownProps.id),
    deadlinePassed: isCfeiDeadlinePassed(state, ownProps.id),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  getReviewers: () => dispatch(loadReviewers(ownProps.id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewersSummary);
