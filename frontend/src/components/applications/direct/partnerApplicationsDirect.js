import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GridColumn from '../../common/grid/gridColumn';
import PartnerApplicationsDirectFilter from './partnerApplicationsDirectFilter';
import PaginatedList from '../../common/list/paginatedList';


class PartnerApplicationsDirect extends Component {
  render() {
    const { partners, columns } = this.props;

    return (
      <GridColumn container direction="column" gutter={24}>
        <PartnerApplicationsDirectFilter />
        <PaginatedList
          items={partners}
          columns={columns}
          onPageSizeChange={pageSize => console.log('Page size', pageSize)}
          onCurrentPageChange={page => console.log('Page number', page)}
        />
      </GridColumn>
    );
  }
}

PartnerApplicationsDirect.propTypes = {
  partners: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  partners: state.applicationsDirectList.notes,
  columns: state.applicationsDirectList.columns,
});


export default connect(mapStateToProps, null)(PartnerApplicationsDirect);
