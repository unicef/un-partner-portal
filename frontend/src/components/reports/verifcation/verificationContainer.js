
import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { TableCell } from 'material-ui/Table';
import { withRouter } from 'react-router';
import CustomGridColumn from '../../common/grid/customGridColumn';
import VerificationFilter from './verificationFilter';
import PaginatedList from '../../common/list/paginatedList';
import TableWithStateInUrl from '../../common/hoc/tableWithStateInUrl';
import { getVerificationReport } from '../../../reducers/partnerReportsGeneration';
import { loadVerificationReportsList } from '../../../reducers/reportsVerificationList';
import { isQueryChanged } from '../../../helpers/apiHelper';
import PartnerNameCell from './partnerNameCell';
import Loader from '../../common/loader';
import { checkPermission, AGENCY_PERMISSIONS } from '../../../helpers/permissions';

const messages = {
  exportReport: 'Export report',
};

class VerificationContainer extends Component {
  componentWillMount() {
    const { query } = this.props;
    this.props.loadReports(query);
  }

  shouldComponentUpdate(nextProps) {
    const { query } = this.props;

    if (isQueryChanged(nextProps, query)) {
      this.props.loadReports(nextProps.location.query);
      return false;
    }

    return true;
  }

  /* eslint-disable class-methods-use-this */
  tableCell({ row, column, value }) {
    if (column.name === 'legal_name') {
      return (<PartnerNameCell
        isVerified={row.is_verified}
        flagInfo={row.flagging_status}
        legalName={row.legal_name}
      />);
    }

    return <TableCell>{value}</TableCell>;
  }

  verificationReport() {
    const { query, getVerificationReports } = this.props;

    const queryPage = R.dissoc('page', query);
    const queryPageSize = R.dissoc('page_size', queryPage);

    getVerificationReports(queryPageSize);
  }

  render() {
    const { items, columns, totalCount, loading, query,
      reportsLoading, hasVerificationReportPermission } = this.props;
    const queryParams = R.omit(['page', 'page_size'], query);

    return (
      <React.Fragment>
        <Loader fullScreen loading={reportsLoading} />
        <CustomGridColumn>
          <VerificationFilter />
          {!R.isEmpty(queryParams)
            && hasVerificationReportPermission
             && <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
               <Button
                 style={{ marginRight: '15px' }}
                 raised
                 color="accent"
                 onTouchTap={() => this.verificationReport()}
               >
                 {messages.exportReport}
               </Button>
             </div>}
          {!R.isEmpty(queryParams) && <TableWithStateInUrl
            component={PaginatedList}
            items={items}
            columns={columns}
            itemsCount={totalCount}
            loading={loading}
            templateCell={this.tableCell}
          />}
        </CustomGridColumn>
      </React.Fragment>
    );
  }
}

VerificationContainer.propTypes = {
  items: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  totalCount: PropTypes.number.isRequired,
  loadReports: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  getVerificationReports: PropTypes.func,
  query: PropTypes.object,
  reportsLoading: PropTypes.bool.isRequired,
  hasVerificationReportPermission: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  items: state.reportVerificationList.items,
  totalCount: state.reportVerificationList.totalCount,
  columns: state.reportVerificationList.columns,
  loading: state.reportVerificationList.loading,
  query: ownProps.location.query,
  reportsLoading: state.generatePartnerReports.loading,
  hasVerificationReportPermission:
    checkPermission(AGENCY_PERMISSIONS.RUN_REPORT_CFEI_MANAGEMENT, state),
});

const mapDispatch = dispatch => ({
  loadReports: params => dispatch(loadVerificationReportsList(params)),
  getVerificationReports: params => dispatch(getVerificationReport(params)),
});

const connectedVerificationContainer =
    connect(mapStateToProps, mapDispatch)(VerificationContainer);
export default withRouter(connectedVerificationContainer);
