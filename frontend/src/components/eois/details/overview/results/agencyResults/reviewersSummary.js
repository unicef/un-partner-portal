import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'ramda';
import Typography from 'material-ui/Typography';
import PaddedContent from '../../../../../common/paddedContent';
import EmptyContent from '../../../../../common/emptyContent';
import HeaderList from '../../../../../common/list/headerList';
import { isUserAFocalPoint, selectCfeiReviewers } from '../../../../../../store';
import { loadReviewers } from '../../../../../../reducers/cfeiReviewers';
import SingleReviewer from './singleReviewer';
import withConditionalDisplay from '../../../../../common/hoc/withConditionalDisplay';
import { isUserNotAgencyReader } from '../../../../../../helpers/authHelpers';

const messages = {
  title: 'Reviewers',
  empty: 'No Reviewers added yet',
};

class ReviewersSummary extends Component {
  componentWillMount() {
    this.props.getReviewers();
  }

  content() {
    const { loading, reviewers, focalPoint } = this.props;
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
        {reviewers.map(reviewer => <SingleReviewer reviewer={reviewer} isFocalPoint={focalPoint} />)}
      </div>);
  }


  render() {
    const { loading } = this.props;
    return (
      <HeaderList
        loading={loading}
        header={<Typography type="headline" >{messages.title}</Typography>}
      >
        {this.content()}
      </HeaderList>
    );
  }
}

ReviewersSummary.propTypes = {
  reviewers: PropTypes.array,
  focalPoint: PropTypes.bool,
  getReviewers: PropTypes.array,
  loading: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  focalPoint: isUserAFocalPoint(state, ownProps.id),
  reviewers: selectCfeiReviewers(state, ownProps.id),
  loading: state.cfeiReviewers.status.loading,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getReviewers: () => dispatch(loadReviewers(ownProps.id)),
});

export default withConditionalDisplay([isUserNotAgencyReader])(
  connect(mapStateToProps, mapDispatchToProps)(ReviewersSummary),
);
