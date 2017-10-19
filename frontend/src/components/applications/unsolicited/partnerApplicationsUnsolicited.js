import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import PropTypes from 'prop-types';
import GridColumn from '../../common/grid/gridColumn';
import PartnerApplicationsNotesFilter from './partnerApplicationsUnsolicitedFilter';
import DirectSelectionCell from './directSelectionCell';
import PaginatedList from '../../common/list/paginatedList';

/* eslint-disable react/prop-types */
const applicationCell = ({ row, column }) => {
  if (column.name === 'direct_selection') {
    return (<DirectSelectionCell
      directSelection={row.direct_selection}
    />);
  }

  return undefined;
};

/* eslint-disable react/prefer-stateless-function */
class PartnerApplicationsUnsolicited extends Component {
  render() {
    const { partners, columns } = this.props;

    return (
      <GridColumn spacing={24}>
        <PartnerApplicationsNotesFilter />
        <PaginatedList
          items={partners}
          columns={columns}
          templateCell={applicationCell}
          onPageSizeChange={pageSize => console.log('Page size', pageSize)}
          onCurrentPageChange={page => console.log('Page number', page)}
        />
      </GridColumn>
    );
  }
}

PartnerApplicationsUnsolicited.propTypes = {
  partners: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  partners: state.applicationsUnsolicitedList.notes,
  columns: state.applicationsUnsolicitedList.columns,
});


export default connect(mapStateToProps, null)(PartnerApplicationsUnsolicited);
