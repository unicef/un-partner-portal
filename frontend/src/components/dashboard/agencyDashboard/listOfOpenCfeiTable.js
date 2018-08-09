import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { TableCell } from 'material-ui/Table';
import Typography from 'material-ui/Typography';
import { loadOpenCfeiList } from '../../../reducers/openCfeiDashboardList';
import PaginatedList from '../../common/list/paginatedList';
import TableWithLocalState from '../../common/hoc/tableWithLocalState';
import { formatDateForPrint } from '../../../helpers/dates';

const columns = [
  { name: 'title', title: 'Project Title' },
  { name: 'displayID', title: 'CFEI' },
  { name: 'applications_count', title: 'Number of Applications' },
  { name: 'deadline_date', title: 'Application deadline' },
];

const renderCells = ({ row, column, value }) => {
  if (column.name === 'displayID') {
    return (
      <TableCell >
        <Typography
          color="accent"
          component={Link}
          to={`/cfei/open/${row.id}`}
        >
          {row.displayID}
        </Typography>
      </TableCell>);
  } else if (column.name === 'deadline_date') {
    return (
      <TableCell >
        {formatDateForPrint(row.deadline_date)}
      </TableCell>);
  }

  return <TableCell>{value}</TableCell>;
};

renderCells.propTypes = {
  row: PropTypes.object,
  column: PropTypes.object,
};


class ListOfCOpenCfeiTable extends Component {
  componentWillMount() {

  }

  render() {
    const { loading, data, loadApplications, itemsCount } = this.props;
    return (
      <TableWithLocalState
        component={PaginatedList}
        items={data}
        itemsCount={itemsCount}
        columns={columns}
        loading={loading}
        templateCell={renderCells}
        loadingFunction={loadApplications}
      />
    );
  }
}

ListOfCOpenCfeiTable.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.array,
  loadApplications: PropTypes.func,
  itemsCount: PropTypes.number,
};

const mapStateToProps = state => ({
  loading: state.openCfeiDashboardList.status.loading,
  data: state.openCfeiDashboardList.data.applications,
  itemsCount: state.openCfeiDashboardList.data.count,
});

const mapDispatchToProps = dispatch => ({
  loadApplications: params => dispatch(loadOpenCfeiList(params)),
});


export default connect(mapStateToProps, mapDispatchToProps)(ListOfCOpenCfeiTable);
