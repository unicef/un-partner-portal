import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GridColumn from '../../common/grid/gridColumn';
import PartnerApplicationsNotesFilter from './partnerApplicationsNotesFilter';
import ConceptNoteIDCell from './conceptNoteIDCell';
import PaginatedList from '../../common/list/paginatedList';

class PartnerApplicationsNotes extends Component {
  applicationCell(row, column, style) {
    if (column.name === 'id' || column.name === 'cfei_id') {
      return (<ConceptNoteIDCell
        id={row.id}
      />);
    }

    return undefined;
  }

  render() {
    const { partners, columns } = this.props;

    return (
      <GridColumn gutter={24}>
        <PartnerApplicationsNotesFilter />
        <PaginatedList
          items={partners}
          columns={columns}
          templateCell={(row, column, style) => this.applicationCell(row, column, style)}
          onPageSizeChange={pageSize => console.log('Page size', pageSize)}
          onCurrentPageChange={page => console.log('Page number', page)}
        />
      </GridColumn>
    );
  }
}

PartnerApplicationsNotes.propTypes = {
  partners: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  partners: state.applicationsNotesList.notes,
  columns: state.applicationsNotesList.columns,
});


export default connect(mapStateToProps, null)(PartnerApplicationsNotes);
