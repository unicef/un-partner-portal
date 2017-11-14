import React, { Component } from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { pluckAll } from '../../../../reducers/normalizationHelpers';
import CompareApplicationsContent from './compareApplicationsContent';
import { loadApplicationComparison } from '../../../../reducers/applicationsComparison';
import EmptyContent from '../../../common/emptyContent';
import Loader from '../../../common/loader';

const labels = {
  partner_name: 'Partner',
  id: 'Concept Note Id',
  total_assessment_score: 'Average score',
  verification_status: 'Verification status',
  flagging_status: 'Flagging status',
  un_exp: 'UN Experience',
  annual_budget: 'Annual Budget(USD)',
};

const mapProperties = pluckAll(R.keys(labels));

class CompareApplicationContentContainer extends Component {
  componentWillMount() {
    this.props.getComparison();
  }

  render() {
    const { loading, applications, comparison, params: { id, type } } = this.props;
    if (loading || R.isEmpty(comparison)) return <Loader loading={loading}><EmptyContent /></Loader>;
    let fullComparison = R.prepend(labels, comparison);
    const columns = fullComparison.length;
    fullComparison = mapProperties(fullComparison);
    fullComparison = R.update(
      1,
      R.prepend(
        labels.id,
        applications,
      ),
      fullComparison,
    );
    return (<CompareApplicationsContent
      applications={applications}
      columns={columns}
      comparison={fullComparison}
      id={id}
      type={type}
    />);
  }
}

CompareApplicationContentContainer.propTypes = {
  comparison: PropTypes.array,
  getComparison: PropTypes.func,
  params: PropTypes.object,
  loading: PropTypes.bool,
  applications: PropTypes.array,
};

const mapStateToProps = state => ({
  loading: state.applicationComparison.status.loading,
  comparison: state.applicationComparison.data,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getComparison: () => dispatch(
    loadApplicationComparison(ownProps.params.id, ownProps.applications)),
});


export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CompareApplicationContentContainer));
