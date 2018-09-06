import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { TableCell } from 'material-ui/Table';
import Typography from 'material-ui/Typography';
import { loadApplicationsToScore } from '../../../reducers/applicationsToScore';
import PaginatedList from '../../common/list/paginatedList';
import TableWithLocalState from '../../common/hoc/tableWithLocalState';
import { formatDateForPrint } from '../../../helpers/dates';


const columns = [
  { name: 'title', title: 'Project Title', width: 250 },
  { name: 'displayID', title: 'CFEI' },
  { name: 'eoi_applications_count', title: 'Number of Applications' },
  { name: 'deadline_date', title: 'Notification of results deadline' },
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


class ListOfConceptNotesTable extends Component {
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

ListOfConceptNotesTable.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.array,
  loadApplications: PropTypes.func,
  itemsCount: PropTypes.number,
};

const mapStateToProps = state => ({
  loading: state.applicationsToScore.status.loading,
  data: state.applicationsToScore.data.applications,
  itemsCount: state.applicationsToScore.data.count,
});

const mapDispatchToProps = dispatch => ({
  loadApplications: params => dispatch(loadApplicationsToScore(params)),
});


export default connect(mapStateToProps, mapDispatchToProps)(ListOfConceptNotesTable);
