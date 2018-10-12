import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { TableCell } from 'material-ui/Table';
import HeaderList from '../../common/list/headerList';
import { loadPendingOffers } from '../../../reducers/pendingOffers';
import PaginatedList from '../../common/list/paginatedList';
import TableWithLocalState from '../../common/hoc/tableWithLocalState';
import EoiCountryCell from '../../eois/cells/eoiCountryCell';
import EoiSectorCell from '../../eois/cells/eoiSectorCell';
import ApplicationIDCell from './applicationId';

const messages = {
  title: 'List of Pending Offers',
};

const columns = [
  { name: 'cn_id', title: 'Application ID' },
  { name: 'project_title', title: 'Project Title', width: 250 },
  { name: 'cfei_type', title: 'Offer Type' },
  { name: 'agency_name', title: 'UN Agency' },
  { name: 'countries', title: 'Country' },
  { name: 'specializations', title: 'Sector & Area of Specialization' },
];

const renderCells = ({ row, column, value }) => {
  if (column.name === 'cn_id') {
    return (<ApplicationIDCell type={row.cfei_type} eoiId={row.eoi_id} cnId={row.cn_id} />);
  } else if (column.name === 'countries') {
    return (
      <TableCell >
        {row.countries.map((code, index) =>
          (<span key={code}>
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
  return <TableCell><Typography>{value}</Typography></TableCell>;
};

renderCells.propTypes = {
  row: PropTypes.object,
  column: PropTypes.object,
};

const ListOfPendingOffers = (props) => {
  const { loading, data = [], loadOffers, itemsCount } = props;
  return (
    <HeaderList
      header={<Typography style={{ margin: 'auto 0' }} type="headline" >{messages.title}</Typography>}
      loading={loading}
    >
      <TableWithLocalState
        component={PaginatedList}
        items={data}
        itemsCount={itemsCount}
        columns={columns}
        loading={loading}
        templateCell={renderCells}
        loadingFunction={loadOffers}
      />
    </HeaderList>
  );
};

ListOfPendingOffers.propTypes = {
  loading: PropTypes.bool,
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
