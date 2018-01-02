import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import R from 'ramda';
import Typography from 'material-ui/Typography';
import HeaderList from '../../../../../common/list/headerList';
import { selectReview } from '../../../../../../store';
import EmptyContent from '../../../../../common/emptyContent';
import SingleReview from './singleReview';

const messages = {
  title: 'Reviews',
};

const renderContent = (reviews) => {
  if (R.isEmpty(reviews)) return <EmptyContent />;
  return R.map(([reviewer, assessment]) => (<SingleReview
    key={reviewer}
    reviewer={reviewer}
    assessment={assessment}
  />), reviews);
};


const Reviews = (props) => {
  const { loading, reviews } = props;
  return (
    <HeaderList
      header={<Typography type="headline" >{messages.title}</Typography>}
      loading={loading}
    >
      {renderContent(reviews)}
    </HeaderList>
  );
};

Reviews.propTypes = {
  loading: PropTypes.bool,
  reviews: PropTypes.array,
};

const mapStateToProps = (state, ownProps) => {
  const currentUser = state.session.userId;
  const { applicationId, isUserFocalPoint } = ownProps;
  let reviews = R.toPairs(selectReview(state, applicationId));
  if (!isUserFocalPoint) {
    reviews = R.filter(([reviewer]) => +reviewer === currentUser, reviews);
  } else {
    reviews = R.sort(([reviewer]) => +reviewer !== currentUser, reviews);
  }
  return {
    loading: state.applicationReviews.status.loading,
    reviews,
  };
};

export default connect(mapStateToProps)(Reviews);
