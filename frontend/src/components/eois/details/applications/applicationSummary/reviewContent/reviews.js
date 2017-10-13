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
  if (!reviews) return [<EmptyContent />];
  const a = R.map(key => (<SingleReview
    key={key}
    reviewer={key}
    assessment={reviews[key]}
  />),
  R.keys(reviews));
  return a;
};


const Reviews = (props) => {
  const { loading, reviews } = props;
  return (
    <HeaderList
      header={<Typography type="headline" >{messages.title}</Typography>}
      loading={loading}
      rows={renderContent(reviews)}
    />
  );
};

Reviews.propTypes = {
  loading: PropTypes.bool,
  reviews: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  loading: state.applicationReviews.status.loading,
  reviews: selectReview(state, ownProps.applicationId),

});

export default connect(mapStateToProps)(Reviews);
