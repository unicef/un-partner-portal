import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'ramda';
import Typography from 'material-ui/Typography';
import PaddedContent from '../../../../../common/paddedContent';
import EmptyContent from '../../../../../common/emptyContent';
import HeaderList from '../../../../../common/list/headerList';
import { isUserAFocalPoint, selectCfeiReviewSummary, isUserACreator } from '../../../../../../store';
import { loadReviewSummary } from '../../../../../../reducers/cfeiReviewSummary';
import ChangeSummaryButton from '../../../../buttons/changeSummaryButton';
import ReviewSummaryForm from '../../../../modals/changeSummary/changeSummaryForm';
import withConditionalDisplay from '../../../../../common/hoc/withConditionalDisplay';
import { isUserNotAgencyReader } from '../../../../../../helpers/authHelpers';

const messages = {
  title: 'Review Summary',
  empty: 'No Review Summary added yet',
};

class ReviewSummary extends Component {
  componentWillMount() {
    this.props.getReviewSummary();
  }

  content() {
    const { id, loading, focalPoint, summary } = this.props;
    if (loading) {
      return <EmptyContent />;
    } else if (!summary || isEmpty(summary)) {
      return (<PaddedContent>
        <Typography>
          {messages.empty}
        </Typography>
        {focalPoint && <ChangeSummaryButton
          cfeiId={id}
          edit={!!summary.review_summary_comment}
        />}
      </PaddedContent>);
    }
    return (
      <PaddedContent>
        <ReviewSummaryForm form="changeSummaryReadOnly" readOnly cfeiId={id} />
        {focalPoint && <ChangeSummaryButton
          cfeiId={id}
          edit={!!summary.review_summary_comment}
        />}
      </PaddedContent>);
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

ReviewSummary.propTypes = {
  id: PropTypes.string,
  summary: PropTypes.object,
  focalPoint: PropTypes.bool,
  loading: PropTypes.bool,
  getReviewSummary: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  focalPoint: isUserAFocalPoint(state, ownProps.id) || isUserACreator(state, ownProps.id),
  loading: state.cfeiReviewSummary.status.loading,
  summary: selectCfeiReviewSummary(state, ownProps.id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getReviewSummary: () => dispatch(loadReviewSummary(ownProps.id)),
});

export default withConditionalDisplay([isUserNotAgencyReader])(
  connect(mapStateToProps, mapDispatchToProps)(ReviewSummary),
);
