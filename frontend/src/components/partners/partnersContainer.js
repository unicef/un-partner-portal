import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { TableCell } from 'material-ui/Table';
import { browserHistory as history, withRouter } from 'react-router';
import MainContentWrapper from '../../components/common/mainContentWrapper';
import HeaderNavigation from '../../components/common/headerNavigation';
import PartnersFilter from './partnersFilter';
import PartnerProfileNameCell from './partnerProfileNameCell';
import PaginatedList from '../common/list/paginatedList';
import TableWithStateInUrl from '../common/hoc/tableWithStateInUrl';
import OrganizationTypeCell from '../applications/organizationTypeCell';
import PartnerProfileDetailItem from './partnerProfileDetailItem';
import { loadPartnersList } from '../../reducers/agencyPartnersList';
import PartnerProfileCountryCell from './partnerProfileCountryCell';
import PartnerProfileExperienceCell from './partnerProfileExperienceCell';
import { isQueryChanged } from '../../helpers/apiHelper';

const messages = {
  header: 'Partners',
};

class PartnersContainer extends Component {
  componentWillMount() {
    const { query } = this.props;
    this.props.loadPartners(query);
  }

  shouldComponentUpdate(nextProps) {
    const { query } = this.props;

    if (isQueryChanged(nextProps, query)) {
      this.props.loadPartners(nextProps.location.query);
      return false;
    }

    return true;
  }

  /* eslint-disable class-methods-use-this */
  partnerCell({ row, column, value }) {
    if (column.name === 'name') {
      return (<PartnerProfileNameCell
        info={row.partner_additional}
        onClick={() => history.push(`/partner/${row.id}/overview`)}
      />);
    } else if (column.name === 'country_code') {
      return <PartnerProfileCountryCell code={row.country_code} />;
    } else if (column.name === 'experience_working') {
      return <PartnerProfileExperienceCell experience={row.experience_working} />;
    } else if (column.name === 'display_type') {
      return <OrganizationTypeCell orgType={row.display_type} />;
    }

    return <TableCell><Typography>{value}</Typography></TableCell>;
  }

  render() {
    const { partners, columns, totalCount, loading } = this.props;

    return (
      <HeaderNavigation title={messages.header}>
        <MainContentWrapper>
          <Grid container direction="column" spacing={24}>
            <Grid item>
              <PartnersFilter />
            </Grid>
            <Grid item>
              <TableWithStateInUrl
                component={PaginatedList}
                items={partners}
                columns={columns}
                itemsCount={totalCount}
                expandable
                loading={loading}
                templateCell={this.partnerCell}
                expandedCell={row => <PartnerProfileDetailItem partner={row} />}
              />
            </Grid>
          </Grid>
        </MainContentWrapper>
      </HeaderNavigation>
    );
  }
}

PartnersContainer.propTypes = {
  partners: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  totalCount: PropTypes.number.isRequired,
  loadPartners: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  query: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  partners: state.agencyPartnersList.data.partners,
  totalCount: state.agencyPartnersList.data.totalCount,
  columns: state.agencyPartnersList.data.columns,
  loading: state.agencyPartnersList.status.loading,
  query: ownProps.location.query,
});

const mapDispatch = dispatch => ({
  loadPartners: params => dispatch(loadPartnersList(params)),
});

const connectedPartnersContainer = connect(mapStateToProps, mapDispatch)(PartnersContainer);
export default withRouter(connectedPartnersContainer);
