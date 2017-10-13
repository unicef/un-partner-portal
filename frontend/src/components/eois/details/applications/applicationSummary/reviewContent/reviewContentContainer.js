import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReviewContent from './reviewContent';
import { loadApplicationReviews } from '../../../../../../reducers/applicationReviews';

class ReviewContentContainer extends Component {
  componentWillMount() {
    this.props.downloadReviews();
  }

  render() {
    const { applicationId } = this.props;
    return (
      <ReviewContent applicationId={applicationId} />
    );
  }
}

ReviewContentContainer.propTypes = {
  downloadReviews: PropTypes.func,
};

const mapDispatchToProps =
  (dispatch, ownProps) => ({
    downloadReviews: () => dispatch(loadApplicationReviews(ownProps.applicationId)),
  });


export default connect(null, mapDispatchToProps)(ReviewContentContainer);
