import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { Link } from 'react-router';
import { TableCell } from 'material-ui/Table';
import HeaderList from '../../common/list/headerList';
import { loadPendingOffers } from '../../../reducers/pendingOffers';
import PaginatedList from '../../common/list/paginatedList';
import TableWithLocalState from '../../common/hoc/tableWithLocalState';
import EoiCountryCell from '../../eois/cells/eoiCountryCell';
import EoiSectorCell from '../../eois/cells/eoiSectorCell';

const messages = {
  title: 'List of Pending Offers',
};

const columns = [
  { name: 'cn_id', title: 'Application ID' },
  { name: 'project_title', title: 'Project Title' },
  { name: 'cfei_type', title: 'Offer Type' },
  { name: 'agency_name', title: 'UN Agency' },
  { name: 'countries', title: 'Country' },
  { name: 'specializations', title: 'Sector & Area of Specialization' },
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

const ListOfPendingOffers = (props) => {
  const { loading, data = [], loadOffers, itemsCount } = props;
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
        loadingFunction={loadOffers}
      />]}
    />
  );
};

ListOfPendingOffers.propTypes = {
  loading: PropTypes.string,
  data: PropTypes.array,
  loadOffers: PropTypes.func,
  itemsCount: PropTypes.number,
};

const mapStateToProps = state => ({
  loading: state.pendingOffers.status.loading,
  data: state.pendingOffers.data.pendingOffers,
  itemsCount: state.pendingOffers.data.count,
});

const mapDispatchToProps = dispatch => ({
  loadOffers: params => dispatch(loadPendingOffers(params)),
});


export default connect(mapStateToProps, mapDispatchToProps)(ListOfPendingOffers);
