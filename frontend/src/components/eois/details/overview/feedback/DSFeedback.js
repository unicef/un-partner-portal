import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Feedback from '../../../../applications/feedback/feedbackContainer';
import { loadApplications } from '../../../../../reducers/partnersApplicationsList';
import Loader from '../../../../common/loader';
import EmptyContent from '../../../../common/emptyContent';
import GridColumn from '../../../../common/grid/gridColumn';
import {
  isUserAFocalPoint,
  isUserACreator,
} from '../../../../../store';

class DSFeedback extends Component {
  componentWillMount() {
    this.props.loadApplications({ page: 1, page_size: 100 });
  }

  render() {
    const { applications, loading, shouldAddFeedback } = this.props;
    if (loading) {
      return (<Loader loading={loading}>
        <EmptyContent />
      </Loader>);
    }
    return (
      <GridColumn>
        {applications.map(application =>
          (<Feedback
            key={application.id}
            applicationId={`${application.id}`}
            extraTitle={application.legal_name}
            allowedToAdd={shouldAddFeedback}
          />))}
      </GridColumn>
    );
  }
}


DSFeedback.propTypes = {
  applications: PropTypes.array,
  loading: PropTypes.bool,
  loadApplications: PropTypes.func,
  shouldAddFeedback: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  applications: state.partnersApplicationsList.data.applications || [],
  loading: state.partnersApplicationsList.status.loading,
  shouldAddFeedback: isUserAFocalPoint(state, ownProps.id) || isUserACreator(state, ownProps.id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadApplications: query => dispatch(loadApplications(ownProps.id, query)),
});


export default connect(mapStateToProps, mapDispatchToProps)(DSFeedback);
