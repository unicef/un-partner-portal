import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Checkbox from 'material-ui/Checkbox';
import { TableCell } from 'material-ui/Table';
import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router';
import AlertDialog from '../../common/alertDialog';
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
  partnerMapping: 'Map of Partners',
  report: 'Report download',
};

const styleSheet = () => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  root: {
    color: '#FFF',
    '&$checked': {
      color: '#FFF',
    },
  },
  checked: {},
});

const HeaderActionsBase = (props) => {
  const { classes, listRef, checked } = props;

  return (
    <div className={classes.container}>{'Select All'}
      <Checkbox
        checked={checked}
        onChange={(e, checked) => {
          if (checked) {
            listRef.getWrappedInstance().getWrappedInstance().selectAll();
          } else {
            listRef.getWrappedInstance().getWrappedInstance().clearSelections();
          }
        }}
        classes={{
          root: checked ? classes.root : null,
          checked: classes.checked,
        }}
      />
    </div>
  );
};

export const HeaderActions = withStyles(styleSheet, { name: 'HeaderActionsBase' })(HeaderActionsBase);

class PartnerInfoContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDownloadInfo: false,
      downloadInfo: null,
    };
  }

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
      getPartnerProfileReports(queryPageSize).then((data) => {
        this.setState({
          showDownloadInfo: true,
          downloadInfo: data.length > 0 && data[0],
        });
      });
    } else {
      getPartnerProfileReports({ ids: selectionIds.join(',') }).then((data) => {
        this.setState({
          showDownloadInfo: true,
          downloadInfo: data.length > 0 && data[0],
        });
      });
    }
  }

  partnerContactReport() {
    const { query, getPartnerContactReports, selectionIds } = this.props;

    const queryPage = R.dissoc('page', query);
    const queryPageSize = R.dissoc('page_size', queryPage);

    if (R.isEmpty(selectionIds)) {
      getPartnerContactReports(queryPageSize).then((data) => {
        this.setState({
          showDownloadInfo: true,
          downloadInfo: data.length > 0 && data[0],
        });
      });
    } else {
      getPartnerContactReports({ ids: selectionIds.join(',') }).then((data) => {
        this.setState({
          showDownloadInfo: true,
          downloadInfo: data.length > 0 && data[0],
        });
      });
    }
  }

  partnerMappingReport() {
    const { query, getPartnerMappingReports, selectionIds } = this.props;

    const queryPage = R.dissoc('page', query);
    const queryPageSize = R.dissoc('page_size', queryPage);

    if (R.isEmpty(selectionIds)) {
      getPartnerMappingReports(queryPageSize).then((data) => {
        this.setState({
          showDownloadInfo: true,
          downloadInfo: data.length > 0 && data[0],
        });
      });
    } else {
      getPartnerMappingReports({ ids: selectionIds.join(',') }).then((data) => {
        this.setState({
          showDownloadInfo: true,
          downloadInfo: data.length > 0 && data[0],
        });
      });
    }
  }

  render() {
    const { items, columns, totalCount,
      loading, reportsLoading,
      hasCSOMappingPermission,
      hasCSOContactPermission,
      query,
      selectionIds,
      hasCSOProfilePermission } = this.props;

    const queryParams = R.omit(['page', 'page_size'], query);

    return (
      <React.Fragment>
        <Loader fullscreen loading={reportsLoading || loading} />
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
            componentHeaderAction={<HeaderActions checked={items.length === selectionIds.length} listRef={this.listRef} />}
            hideList={R.isEmpty(queryParams)}
            itemsCount={totalCount}
            templateCell={this.tableCell}
          />
        </CustomGridColumn>
        <AlertDialog
          trigger={!!this.state.showDownloadInfo}
          title={messages.report}
          text={this.state.downloadInfo}
          handleDialogClose={() => this.setState({ showDownloadInfo: false })}
        />
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
