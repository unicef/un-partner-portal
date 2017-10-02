import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GridColumn from '../../common/grid/gridColumn';
import PartnerApplicationsNotesFilter from './partnerApplicationsNotesFilter';
import ConceptNoteIDCell from './conceptNoteIDCell';
import PaginatedList from '../../common/list/paginatedList';

/* eslint-disable react/prop-types */
const applicationCell = ({ row, column }) => {
  if (column.name === 'id' || column.name === 'cfei_id') {
    return (<ConceptNoteIDCell
      id={row.id}
    />);
  }

  return undefined;
};

/* eslint-disable react/prefer-stateless-function */
class PartnerApplicationsNotes extends Component {
  render() {
    const { partners, notesColumns } = this.props;

    return (
      <GridColumn spacing={24}>
        <PartnerApplicationsNotesFilter />
        <PaginatedList
          items={partners}
          columns={notesColumns}
          templateCell={applicationCell}
          onPageSizeChange={pageSize => console.log('Page size', pageSize)}
          onCurrentPageChange={page => console.log('Page number', page)}
        />
      </GridColumn>
    );
  }
}

PartnerApplicationsNotes.propTypes = {
  partners: PropTypes.array.isRequired,
  notesColumns: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  partners: state.applicationsNotesList.notes,
  notesColumns: state.applicationsNotesList.columns,
});


export default connect(mapStateToProps, null)(PartnerApplicationsNotes);
