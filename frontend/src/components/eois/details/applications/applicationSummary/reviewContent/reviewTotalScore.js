import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import R from 'ramda';
import Typography from 'material-ui/Typography';
import HeaderList from '../../../../../common/list/headerList';
import { selectReview, selectAssessment } from '../../../../../../store';
import EmptyContent from '../../../../../common/emptyContent';
import SpreadContent from '../../../../../common/spreadContent';
import PaddedContent from '../../../../../common/paddedContent';
import { calcTotalScore } from './singleReview';

const messages = {
  title: 'Total score',
  assessmentMade: (text, madeReviews, totalReviewers) =>
    `Assessment made by ${madeReviews} of ${totalReviewers} agency users`,
};

const renderContent = (loading, madeReviews, totalReviewers) => {
  if (loading) return [<EmptyContent />];
  return (
    [<PaddedContent>
      <Typography >
        {messages.assessmentMade`${madeReviews}${totalReviewers}`}
      </Typography>
    </PaddedContent>]
  );
};

const ReviewsTotalScore = (props) => {
  const { loading, totalCount, madeReviews, totalReviewers } = props;
  return (
    <HeaderList
      header={<SpreadContent>
        <Typography type="headline" >
          {messages.title}
        </Typography>
        <Typography type="headline" >
          {totalCount}
        </Typography>

      </SpreadContent>
      }
      loading={loading}
      rows={renderContent(loading, madeReviews, totalReviewers)}
    />
  );
};

ReviewsTotalScore.propTypes = {
  loading: PropTypes.bool,
  totalCount: PropTypes.number,
  madeReviews: PropTypes.number,
  totalReviewers: PropTypes.number,
};

const mapStateToProps = (state, ownProps) => {
  const { applicationId } = ownProps;
  const reviews = R.toPairs(selectReview(state, applicationId));
  let totalCount = 0;
  let madeReviews = 0;
  const totalReviewers = reviews.length;
  reviews.forEach(([reviewer, assessment]) => {
    if (assessment) {
      const assessmentInfo = selectAssessment(state, assessment);
      totalCount += calcTotalScore(assessmentInfo);
      madeReviews += 1;
    }
  });
  return {
    loading: state.applicationReviews.status.loading,
    totalCount,
    madeReviews,
    totalReviewers,
  };
};

export default connect(mapStateToProps)(ReviewsTotalScore);
