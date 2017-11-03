import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { Link } from 'react-router';
import { TableCell } from 'material-ui/Table';
import HeaderList from '../../common/list/headerList';
import { loadSubmittedCN } from '../../../reducers/submittedCN';
import PaginatedList from '../../common/list/paginatedList';
import TableWithLocalState from '../../common/hoc/tableWithLocalState';
import EoiCountryCell from '../../eois/cells/eoiCountryCell';
import EoiSectorCell from '../../eois/cells/eoiSectorCell';

const messages = {
  title: 'List of Submitted Concept Notes',
};

const columns = [
  { name: 'cn_id', title: 'Concept Note ID' },
  { name: 'project_title', title: 'Project title' },
  { name: 'cfei_type', title: 'Type of CFEI' },
  { name: 'agency_name', title: 'Agency' },
  { name: 'countries', title: 'Country' },
  { name: 'specializations', title: 'Sector & Area of Specialization' },
  { name: 'offer_status', title: 'Status' },
];

const renderCells = ({ row, column }) => {
  if (column.name === 'cn_id') {
    return (
      <TableCell >
        <Typography
          color="accent"
          component={Link}
          to={`/cfei/open/${row.cn_id}`}
        >
          {row.cn_id}
        </Typography>
      </TableCell>);
  } else if (column.name === 'countries') {
    return (
      <TableCell >
        {row.countries.map((code, index) =>
          (<span>
            <EoiCountryCell code={code} />
            {(index === row.countries.length - 1) ? '' : ', '}
          </span>),
        )}
      </TableCell>);
  } else if (column.name === 'specializations') {
    return (
      <TableCell >
        <EoiSectorCell data={row.specializations} id={row.id} />
      </TableCell>);
  }
  return undefined;
};

renderCells.propTypes = {
  row: PropTypes.object,
  column: PropTypes.object,
};

const ListOfSubmittedCN = (props) => {
  const { loading, data = [], loadCN, itemsCount } = props;
  return (
    <HeaderList
      header={<Typography type="headline" >{messages.title}</Typography>}
      loading={loading}
      rows={[<TableWithLocalState
        component={PaginatedList}
        items={data}
        itemsCount={itemsCount}
        columns={columns}
        loading={loading}
        templateCell={renderCells}
        loadingFunction={loadCN}
      />]}
    />
  );
};

ListOfSubmittedCN.propTypes = {
  loading: PropTypes.string,
  data: PropTypes.array,
  loadCN: PropTypes.func,
  itemsCount: PropTypes.number,
};

const mapStateToProps = state => ({
  loading: state.submittedCN.status.loading,
  data: state.submittedCN.data.submittedCN,
  itemsCount: state.submittedCN.data.count,
});

const mapDispatchToProps = dispatch => ({
  loadCN: params => dispatch(loadSubmittedCN(params)),
});


export default connect(mapStateToProps, mapDispatchToProps)(ListOfSubmittedCN);
