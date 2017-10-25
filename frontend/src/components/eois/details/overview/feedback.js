import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Feedback from '../../../applications/feedback/feedbackContainer';
import { loadApplications } from '../../../../reducers/partnersApplicationsList';
import Loader from '../../../common/loader';
import EmptyContent from '../../../common/emptyContent';
import GridColumn from '../../../common/grid/gridColumn';

class CfeiFeedback extends Component {
  componentWillMount() {
    this.props.loadApplications({ page: 1, page_size: 100 });
  }

  render() {
    const { applications, loading } = this.props;
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
            applicationId={application.id}
            extraTitle={application.legal_name}
          />))}
      </GridColumn>
    );
  }
}


CfeiFeedback.propTypes = {
  type: PropTypes.string,
  applications: PropTypes.array,
  loading: PropTypes.func,
  loadApplications: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  type: ownProps.params.type,
  applications: state.partnersApplicationsList.applicationsList.applications || [],
  loading: state.partnersApplicationsList.status.loading,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadApplications: query => dispatch(loadApplications(ownProps.params.id, query)),
});


export default connect(mapStateToProps, mapDispatchToProps)(CfeiFeedback);
