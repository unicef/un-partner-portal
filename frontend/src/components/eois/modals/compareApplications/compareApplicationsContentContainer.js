import React, { Component } from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { pluckAll } from '../../../../reducers/normalizationHelpers';
import CompareApplicationsContent from './compareApplicationsContent';
import { loadApplicationComparison } from '../../../../reducers/applicationsComparison';
import { downloadComparisonReport } from '../../../../reducers/applicationsComparisonReport';
import EmptyContent from '../../../common/emptyContent';
import Loader from '../../../common/loader';

const labels = {
  partner_name: 'Partner',
  id: 'Concept Note Id',
  total_assessment_score: 'Average score',
  verification_status: 'Verification status',
  flagging_status: 'Flagging status',
  year_establishment: 'Year of Establishment',
  un_exp: 'UN Experience',
  annual_budget: 'Annual Budget(USD)',
};

const mapProperties = pluckAll(R.keys(labels));

class CompareApplicationContentContainer extends Component {
  componentWillMount() {
    this.props.getComparison();
  }

  render() {
    const { loading, report, loadReport, applications, comparison, params: { id, type } } = this.props;
    if (loading || R.isEmpty(comparison) || (applications.length !== comparison.length)) {
      return <Loader loading={loading}><EmptyContent /></Loader>;
    }
    const applicationMeta = R.map(R.pick(['did_win', 'did_withdraw', 'assessments_is_completed']),
      comparison);
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
      applicationsMeta={applicationMeta}
      loading={loading}
      onPrint={loadReport}
      report={report}
    />);
  }
}

CompareApplicationContentContainer.propTypes = {
  comparison: PropTypes.array,
  getComparison: PropTypes.func,
  params: PropTypes.object,
  loading: PropTypes.bool,
  applications: PropTypes.array,
  loadReport: PropTypes.func,
  report: PropTypes.string,
  loadingReport: PropTypes.bool,
};

const mapStateToProps = state => ({
  loading: state.applicationComparison.status.loading,
  loadingReport: state.applicationComparisonReport.status.loading,
  comparison: state.applicationComparison.data,
  report: state.applicationComparisonReport.data,
});

const mapDispatchToProps = (dispatch, { params: { id }, applications }) => ({
  getComparison: () => dispatch(
    loadApplicationComparison(id, applications)),
  loadReport: () => dispatch(downloadComparisonReport(id, applications)),
});


export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CompareApplicationContentContainer));
