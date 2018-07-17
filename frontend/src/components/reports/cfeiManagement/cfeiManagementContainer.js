import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TableCell } from 'material-ui/Table';
import { withRouter } from 'react-router';
import CfeiManagementFilter from './cfeiManagementFilter';
import CustomGridColumn from '../../common/grid/customGridColumn';
import SelectableList from '../../common/list/selectableList';
import { loadCfeiReportsList } from '../../../reducers/reportsCfeiManagementList';
import { isQueryChanged } from '../../../helpers/apiHelper';
import CountriesCell from './countriesCell';
import LocationsCell from './locationsCell';

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
    } else if (column.name === 'project_locations') {
      return <LocationsCell locations={row.locations} />;
    }
    return <TableCell>{value}</TableCell>;
  }

  render() {
    const { items, columns, totalCount, loading } = this.props;

    return (
      <React.Fragment>
        <CustomGridColumn>
          <CfeiManagementFilter />
          <SelectableList
            ref={(field) => { this.listRef = field; }}
            items={items}
            columns={columns}
            loading={loading}
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
};

const mapStateToProps = (state, ownProps) => ({
  items: state.reportsCfeiManagementList.items,
  totalCount: state.reportsCfeiManagementList.totalCount,
  columns: state.reportsCfeiManagementList.columns,
  loading: state.reportsCfeiManagementList.loading,
  query: ownProps.location.query,
});

const mapDispatch = dispatch => ({
  loadReports: params => dispatch(loadCfeiReportsList(params)),
});

const connectedCfeiManagementContainer =
    connect(mapStateToProps, mapDispatch)(CfeiManagementContainer);

export default withRouter(connectedCfeiManagementContainer);
