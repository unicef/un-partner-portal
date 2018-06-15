import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TableCell } from 'material-ui/Table';
import CustomGridColumn from '../../common/grid/customGridColumn';
import PartnerApplicationsNotesFilter from './partnerApplicationsUnsolicitedFilter';
import DirectSelectionCell from './directSelectionCell';
import ConceptNoteIDCell from '../conceptNoteIDCell';
import PaginatedList from '../../common/list/paginatedList';
import TableWithStateInUrl from '../../common/hoc/tableWithStateInUrl';
import { loadApplicationsUcn } from '../../../reducers/applicationsUnsolicitedList';
import { isQueryChanged } from '../../../helpers/apiHelper';
import { formatDateForPrint } from '../../../helpers/dates';
import WrappedCell from '../../common/cell/wrappedCell';
import EoiSectorCell from '../../eois/cells/eoiSectorCell';
import { PROJECT_TYPES } from '../../../helpers/constants';
import CountriesCell from '../../partners/countriesCell';
import ApplicationStatusCell from '../../eois/cells/applicationStatusCell';

/* eslint-disable react/prop-types */
const applicationCell = ({ row, column, value }) => {
  if (column.name === 'is_direct') {
    return (<DirectSelectionCell
      directSelection={row.is_direct}
    />);
  } else if (column.name === 'submission_date') {
    return <WrappedCell content={formatDateForPrint(row.submission_date)} />;
  } else if (column.name === 'id') {
    return (<ConceptNoteIDCell
      cfeiId={`${row.id}`}
      id={row.id}
      type={PROJECT_TYPES.UNSOLICITED}
    />);
  } else if (column.name === 'specializations') {
    return <TableCell><EoiSectorCell data={row.specializations} id={row.id} /></TableCell>;
  } else if (column.name === 'country') {
    return <CountriesCell countries={row.country} />;
  } else if (column.name === 'application_status') {
    return (<ApplicationStatusCell
      applicationStatus={row.application_status}
      id={row.id}
    />);
  }

  return <TableCell>{value}</TableCell>;
};

class PartnerApplicationsUnsolicited extends Component {
  componentWillMount() {
    const { query } = this.props;
    this.props.loadApplications(query);
  }

  shouldComponentUpdate(nextProps) {
    const { query } = this.props;

    if (isQueryChanged(nextProps, query)) {
      this.props.loadApplications(nextProps.location.query);
      return false;
    }

    return true;
  }

  render() {
    const { columns, items, loading, itemsTotal } = this.props;

    return (
      <CustomGridColumn spacing={24}>
        <PartnerApplicationsNotesFilter />
        <TableWithStateInUrl
          component={PaginatedList}
          items={items}
          columns={columns}
          loading={loading}
          itemsCount={itemsTotal}
          templateCell={applicationCell}
        />
      </CustomGridColumn>
    );
  }
}

PartnerApplicationsUnsolicited.propTypes = {
  columns: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  itemsTotal: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  loadApplications: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  items: state.applicationsUnsolicitedList.items,
  itemsTotal: state.applicationsUnsolicitedList.totalCount,
  loading: state.applicationsUnsolicitedList.loading,
  query: ownProps.location.query,
  columns: state.applicationsUnsolicitedList.columns,
});

const mapDispatch = dispatch => ({
  loadApplications: params => dispatch(loadApplicationsUcn(params)),
});

export default connect(mapStateToProps, mapDispatch)(PartnerApplicationsUnsolicited);
