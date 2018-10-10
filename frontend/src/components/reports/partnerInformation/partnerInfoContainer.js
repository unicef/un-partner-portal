import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { TableCell } from 'material-ui/Table';
import { withRouter } from 'react-router';
import PartnerInfoFilter from './partnerInfoFilter';
import CustomGridColumn from '../../common/grid/customGridColumn';
import SelectableList from '../selectableList';
import { loadPartnerReportsList } from '../../../reducers/reportsPartnerInformationList';
import { getPartnerContactReport, getPartnerProfileReport, getPartnerMappingReport } from '../../../reducers/partnerReportsGeneration';
import { isQueryChanged } from '../../../helpers/apiHelper';
import PartnerMapping from '../partnerMapping';
import Loader from '../../common/loader';
import { checkPermission, AGENCY_PERMISSIONS } from '../../../helpers/permissions';

const messages = {
  partnerProfile: 'Export partner profile report',
  partnerContact: 'Export contact information report',
  partnerMappingReport: 'Export partner mapping report',
  partnerMapping: 'Map of Partner Opportunities',
};

class PartnerInfoContainer extends Component {
  componentWillMount() {
    const { query } = this.props;
    this.props.loadReports(query);
  }

  componentWillReceiveProps(nextProps) {
    const { query } = this.props;

    if (isQueryChanged(nextProps, query)) {
      this.props.loadReports(nextProps.location.query);
    }
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
    if (column.name === 'no_of_offices') {
      return <TableCell>{row.offices.length}</TableCell>;
    }

    return <TableCell>{value || '-'}</TableCell>;
  }

  partnerProfileReport() {
    const { query, getPartnerProfileReports, selectionIds } = this.props;

    const queryPage = R.dissoc('page', query);
    const queryPageSize = R.dissoc('page_size', queryPage);

    if (R.isEmpty(selectionIds)) {
      getPartnerProfileReports(queryPageSize);
    } else {
      getPartnerProfileReports({ ids: selectionIds.join(',') });
    }
  }

  partnerContactReport() {
    const { query, getPartnerContactReports, selectionIds } = this.props;

    const queryPage = R.dissoc('page', query);
    const queryPageSize = R.dissoc('page_size', queryPage);

    if (R.isEmpty(selectionIds)) {
      getPartnerContactReports(queryPageSize);
    } else {
      getPartnerContactReports({ ids: selectionIds.join(',') });
    }
  }

  partnerMappingReport() {
    const { query, getPartnerMappingReports, selectionIds } = this.props;

    const queryPage = R.dissoc('page', query);
    const queryPageSize = R.dissoc('page_size', queryPage);

    if (R.isEmpty(selectionIds)) {
      getPartnerMappingReports(queryPageSize);
    } else {
      getPartnerMappingReports({ ids: selectionIds.join(',') });
    }
  }

  render() {
    const { items, columns, totalCount,
      loading, reportsLoading,
      hasCSOMappingPermission,
      hasCSOContactPermission,
      query,
      hasCSOProfilePermission } = this.props;

    const queryParams = R.omit(['page', 'page_size'], query);

    return (
      <React.Fragment>
        <Loader fullScreen loading={reportsLoading || loading} />
        <CustomGridColumn>
          <PartnerInfoFilter
            clearSelections={() => this.listRef
              && this.listRef.getWrappedInstance().getWrappedInstance().clearSelections()}
          />
          {!R.isEmpty(queryParams) &&
            (hasCSOProfilePermission || hasCSOContactPermission)
            && <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {hasCSOProfilePermission && <Button
                style={{ marginRight: '15px' }}
                raised
                color="accent"
                onTouchTap={() => this.partnerProfileReport()}
              >
                {messages.partnerProfile}
              </Button>}
              {hasCSOContactPermission && <Button
                style={{ marginRight: '15px' }}
                raised
                color="accent"
                onTouchTap={() => this.partnerContactReport()}
              >
                {messages.partnerContact}
              </Button>}
              {(hasCSOContactPermission || hasCSOProfilePermission) && <Button
                raised
                color="accent"
                onTouchTap={() => this.partnerMappingReport()}
              >
                {messages.partnerMappingReport}
              </Button>}
            </div>}
          {!R.isEmpty(queryParams) && hasCSOMappingPermission && <PartnerMapping
            title={messages.partnerMapping}
            items={items}
            fieldName={'offices'}
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

PartnerInfoContainer.propTypes = {
  items: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  totalCount: PropTypes.number.isRequired,
  loadReports: PropTypes.func.isRequired,
  getPartnerContactReports: PropTypes.func.isRequired,
  getPartnerProfileReports: PropTypes.func.isRequired,
  getPartnerMappingReports: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  reportsLoading: PropTypes.bool.isRequired,
  query: PropTypes.object,
  selectionIds: PropTypes.array,
  hasCSOProfilePermission: PropTypes.bool,
  hasCSOContactPermission: PropTypes.bool,
  hasCSOMappingPermission: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  items: state.reportsPartnerList.items,
  totalCount: state.reportsPartnerList.totalCount,
  columns: state.reportsPartnerList.columns,
  loading: state.reportsPartnerList.loading,
  reportsLoading: state.generatePartnerReports.loading,
  query: ownProps.location.query,
  selectionIds: state.selectableList.items,
  hasCSOProfilePermission: checkPermission(AGENCY_PERMISSIONS.RUN_REPORT_CSO_PROFILE, state),
  hasCSOContactPermission: checkPermission(AGENCY_PERMISSIONS.RUN_REPORT_CSO_CONTACT, state),
  hasCSOMappingPermission: checkPermission(AGENCY_PERMISSIONS.RUN_REPORT_CSO_MAPPING, state),
});

const mapDispatch = dispatch => ({
  loadReports: params => dispatch(loadPartnerReportsList(params)),
  getPartnerProfileReports: params => dispatch(getPartnerProfileReport(params)),
  getPartnerContactReports: params => dispatch(getPartnerContactReport(params)),
  getPartnerMappingReports: params => dispatch(getPartnerMappingReport(params)),
});

const connectedPartnerInfoContainer =
connect(
  mapStateToProps,
  mapDispatch,
)(PartnerInfoContainer);

export default withRouter(connectedPartnerInfoContainer);
