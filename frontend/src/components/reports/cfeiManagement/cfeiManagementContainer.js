import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { TableCell } from 'material-ui/Table';
import { withRouter } from 'react-router';
import CfeiManagementFilter from './cfeiManagementFilter';
import CustomGridColumn from '../../common/grid/customGridColumn';
import SelectableList from '../selectableList';
import { loadCfeiReportsList } from '../../../reducers/reportsCfeiManagementList';
import { getProjectReport } from '../../../reducers/partnerReportsGeneration';
import { isQueryChanged } from '../../../helpers/apiHelper';
import CountriesCell from './countriesCell';
import LocationsCell from './locationsCell';
import PartnerMapping from '../partnerMapping';
import Loader from '../../common/loader';
import { checkPermission, AGENCY_PERMISSIONS } from '../../../helpers/permissions';

const messages = {
  exportReport: 'Export report',
  projectMapping: 'Map of Partnership Opportunities',
};

class CfeiManagementContainer extends Component {
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
    if (column.name === 'locations') {
      return <CountriesCell locations={value} />;
    } else if (column.name === 'locations_project') {
      return <LocationsCell locations={row.locations_project} />;
    }
    return <TableCell><Typography>{value}</Typography></TableCell>;
  }

  projectReport() {
    const { query, getProjectReports, selectionIds } = this.props;

    const queryPage = R.dissoc('page', query);
    const queryPageSize = R.dissoc('page_size', queryPage);

    if (R.isEmpty(selectionIds)) {
      getProjectReports(queryPageSize);
    } else {
      getProjectReports({ ids: selectionIds.join(',') });
    }
  }

  render() {
    const { items, columns, totalCount, loading,
      query, reportsLoading, hasCFEIReportPermission } = this.props;

    const queryParams = R.omit(['page', 'page_size'], query);

    return (
      <React.Fragment>
        <Loader fullscreen loading={reportsLoading || loading} />
        <CustomGridColumn>
          <CfeiManagementFilter
            clearSelections={() => this.listRef
              && this.listRef.getWrappedInstance().getWrappedInstance().clearSelections()}
          />
          {!R.isEmpty(queryParams)
            && hasCFEIReportPermission
            && <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                style={{ marginRight: '15px' }}
                raised
                color="accent"
                onTouchTap={() => this.projectReport()}
              >
                {messages.exportReport}
              </Button>
            </div>}
          {!R.isEmpty(queryParams) && <PartnerMapping
            title={messages.projectMapping}
            items={items}
            fieldName={'locations'}
          />}
          <SelectableList
            innerRef={(field) => { this.listRef = field; }}
            items={items}
            columns={columns}
            loading={loading}
            hideList={R.isEmpty(queryParams)}
            itemsCount={totalCount}
            templateCell={this.tableCell}
          />
        </CustomGridColumn>
      </React.Fragment>
    );
  }
}

CfeiManagementContainer.propTypes = {
  items: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  totalCount: PropTypes.number.isRequired,
  loadReports: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  query: PropTypes.object,
  selectionIds: PropTypes.array,
  getProjectReports: PropTypes.func,
  reportsLoading: PropTypes.bool.isRequired,
  hasCFEIReportPermission: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  items: state.reportsCfeiManagementList.items,
  totalCount: state.reportsCfeiManagementList.totalCount,
  columns: state.reportsCfeiManagementList.columns,
  loading: state.reportsCfeiManagementList.loading,
  query: ownProps.location.query,
  selectionIds: state.selectableList.items,
  reportsLoading: state.generatePartnerReports.loading,
  hasCFEIReportPermission: checkPermission(AGENCY_PERMISSIONS.RUN_REPORT_CFEI_MANAGEMENT, state),
});

const mapDispatch = dispatch => ({
  loadReports: params => dispatch(loadCfeiReportsList(params)),
  getProjectReports: params => dispatch(getProjectReport(params)),
});

const connectedCfeiManagementContainer =
    connect(mapStateToProps, mapDispatch)(CfeiManagementContainer);

export default withRouter(connectedCfeiManagementContainer);
