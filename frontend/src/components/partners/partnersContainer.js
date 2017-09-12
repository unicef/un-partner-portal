import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { TableCell } from 'material-ui/Table';
import MainContentWrapper from '../../components/common/mainContentWrapper';
import HeaderNavigation from '../../components/common/headerNavigation';
import PartnerFilter from './partnerFilter';
import PartnerProfileNameCell from './partnerProfileNameCell';
import PaginatedList from '../common/list/paginatedList';
import PartnerProfileDetailItem from './partnerProfileDetailItem';

const messages = {
  header: 'Partners',
};

class PartnersContainer extends Component {
  onRowClick(row) {
    history.push('/partner/1/overview');
  }

  static partnerDetailCell(row) {
    return (
      <PartnerProfileDetailItem partner={row.details} />
    );
  }

  partnerCell(row, column, style) {
    if (column.name === 'name') {
      return (<PartnerProfileNameCell
        verified={row.verified}
        yellowFlag={row.flagYellow}
        redFlag={row.flagRed}
        name={row.name}
      />);
    }

    return <TableCell onClick={() => this.onRowClick(row)}>{row[column.name]}</TableCell>;
  }

  render() {
    const { partners, columns } = this.props;

    return (
      <div>
        <Grid item>
          <HeaderNavigation title={messages.header} />
        </Grid>
        <MainContentWrapper>
          <Grid container direction="column" gutter={24}>
            <Grid item>
              <PartnerFilter />
            </Grid>
            <Grid item>
              <PaginatedList
                items={partners}
                columns={columns}
                expandable
                templateCell={(row, column, style) => this.partnerCell(row, column, style)}
                expandedCell={row => PartnersContainer.partnerDetailCell(row)}
                onRowClick={(row) => { this.onRowClick(row); }}
                onPageSizeChange={pageSize => console.log('Page size', pageSize)}
                onCurrentPageChange={page => console.log('Page number', page)}
              />
            </Grid>
          </Grid>
        </MainContentWrapper>
      </div>
    );
  }
}

PartnersContainer.propTypes = {
  partners: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  partners: state.agencyPartnersList.partners,
  columns: state.agencyPartnersList.columns,
});


export default connect(mapStateToProps, null)(PartnersContainer);
