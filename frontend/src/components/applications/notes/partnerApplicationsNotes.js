import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GridColumn from '../../common/grid/gridColumn';
import PartnerApplicationsNotesFilter from './partnerApplicationsNotesFilter';
import ConceptNoteIDCell from '../conceptNoteIDCell';
import ApplicationStatusCell from '../applicationStatusCell';
import PaginatedList from '../../common/list/paginatedList';
import WrappedCell from '../../common/cell/wrappedCell';
import { loadApplicationsCn } from '../../../reducers/applicationsNotesList';
import { isQueryChanged } from '../../../helpers/apiHelper';
import { formatDateForPrint } from '../../../helpers/dates';
import SectorsCell from '../sectorsCell';
import { PROJECT_TYPES } from '../../../helpers/constants';
import TableWithStateInUrl from '../../common/hoc/tableWithStateInUrl';
import CountriesCell from '../../partners/countriesCell';

/* eslint-disable react/prop-types */
const applicationCell = ({ row, column }) => {
  if (column.name === 'id') {
    return (<ConceptNoteIDCell
      cfeiId={row.eoi_id}
      id={row.id}
      type={PROJECT_TYPES.OPEN}
    />);
  } else if (column.name === 'application_date') {
    return <WrappedCell content={formatDateForPrint(row.application_date)} />;
  } else if (column.name === 'specializations') {
    return <SectorsCell specializations={row.specializations} />;
  } else if (column.name === 'country') {
    return <CountriesCell countries={row.country} />;
  }

  return undefined;
};

/* eslint-disable react/prefer-stateless-function */
class PartnerApplicationsNotes extends Component {
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
    const { notes, notesColumns, itemsTotal, loading } = this.props;

    return (
      <GridColumn spacing={24}>
        <PartnerApplicationsNotesFilter />
        <TableWithStateInUrl
          component={PaginatedList}
          items={notes}
          itemsCount={itemsTotal}
          columns={notesColumns}
          loading={loading}
          templateCell={applicationCell}
        />
      </GridColumn>
    );
  }
}

PartnerApplicationsNotes.propTypes = {
  notes: PropTypes.array.isRequired,
  itemsTotal: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  notesColumns: PropTypes.array.isRequired,
  loadApplications: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  notes: R.path(['conceptNotes'], state.applicationsNotesList) || [],
  itemsTotal: state.applicationsNotesList.totalCount,
  notesColumns: state.applicationsNotesList.columns,
  loading: state.applicationsNotesList.loading,
  query: ownProps.location.query,
});

const mapDispatch = dispatch => ({
  loadApplications: params => dispatch(loadApplicationsCn(params)),
});
export default connect(mapStateToProps, mapDispatch)(PartnerApplicationsNotes);
