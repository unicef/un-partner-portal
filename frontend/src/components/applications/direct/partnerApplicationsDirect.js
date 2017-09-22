import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import MainContentWrapper from '../../../components/common/mainContentWrapper';
import PartnerApplicationsDirectFilter from './partnerApplicationsDirectFilter';
import PaginatedList from '../../common/list/paginatedList';


class PartnerApplicationsDirect extends Component {
  onRowClick(row) {
    // TODO add click
  }

  applicationCell(row, column, style) {
    return undefined;
  }

  render() {
    const { partners, columns } = this.props;

    return (
      <div>
        <Grid container direction="column" gutter={24}>
          <Grid item>
            <PartnerApplicationsDirectFilter />
          </Grid>
          <Grid item>
            <PaginatedList
              items={partners}
              columns={columns}
              templateCell={(row, column, style) => this.applicationCell(row, column, style)}
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

PartnerApplicationsDirect.propTypes = {
  partners: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  partners: state.applicationsDirectList.notes,
  columns: state.applicationsDirectList.columns,
});


export default connect(mapStateToProps, null)(PartnerApplicationsDirect);
