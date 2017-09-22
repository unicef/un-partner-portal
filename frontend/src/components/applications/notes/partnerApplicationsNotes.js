import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import MainContentWrapper from '../../../components/common/mainContentWrapper';
import PartnerApplicationsNotesFilter from './partnerApplicationsNotesFilter';
import ConceptNoteIDCell from './conceptNoteIDCell';
import PaginatedList from '../../common/list/paginatedList';

class PartnerApplicationsNotes extends Component {
  onRowClick(row) {
    // TODO add click
  }

  partnerCell(row, column, style) {
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
      <div>
        <Grid container direction="column" gutter={24}>
          <Grid item>
            <PartnerApplicationsNotesFilter />
          </Grid>
          <Grid item>
            <PaginatedList
              items={partners}
              columns={columns}
              templateCell={(row, column, style) => this.partnerCell(row, column, style)}
              onRowClick={(row) => { this.onRowClick(row); }}
              onPageSizeChange={pageSize => console.log('Page size', pageSize)}
              onCurrentPageChange={page => console.log('Page number', page)}
            />
          </Grid>
        </Grid>
      </div>
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
