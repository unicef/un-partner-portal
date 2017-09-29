import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { browserHistory as history, withRouter } from 'react-router';
import MainContentWrapper from '../../components/common/mainContentWrapper';
import HeaderNavigation from '../../components/common/headerNavigation';
import PartnerFilter from './partnerFilter';
import PartnerProfileNameCell from './partnerProfileNameCell';
import PaginatedList from '../common/list/paginatedList';
import PartnerProfileDetailItem from './partnerProfileDetailItem';
import { loadPartnersList } from '../../reducers/agencyPartnersList';
import PartnerProfileCountryCell from './partnerProfileCountryCell';
import PartnerProfileExperienceCell from './partnerProfileExperienceCell';
import { isQueryChanged } from '../../helpers/apiHelper';

const messages = {
  header: 'Partners',
};

class PartnersContainer extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { query } = this.props;

    if (isQueryChanged(nextProps, query)) {
      this.props.loadPartners(nextProps.location.query);
    }

    return true;
  }

  /* eslint-disable class-methods-use-this */
  partnerCell({ row, column }) {
    if (column.name === 'name') {
      return (<PartnerProfileNameCell
        verified={row.verified}
        yellowFlag={row.flagYellow}
        redFlag={row.flagRed}
        name={row.legal_name}
        onClick={() => history.push(`/partner/${row.id}/overview`)}
      />);
    } else if (column.name === 'country_code') {
      return <PartnerProfileCountryCell code={row.country_code} />;
    } else if (column.name === 'experience_working') {
      return <PartnerProfileExperienceCell experience={row.experience_working} />;
    }

    return undefined;
  }

  render() {
    const { partners, columns, totalCount, loading } = this.props;

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
                itemsCount={totalCount}
                expandable
                loading={loading}
                templateCell={this.partnerCell}
                expandedCell={row => <PartnerProfileDetailItem partner={row.details} />}
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
  totalCount: PropTypes.number.isRequired,
  loadPartners: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  query: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  partners: state.agencyPartnersList.partners,
  totalCount: state.agencyPartnersList.totalCount,
  columns: state.agencyPartnersList.columns,
  loading: state.agencyPartnersList.loading,
  query: ownProps.location.query,
});

const mapDispatch = dispatch => ({
  loadPartners: params => dispatch(loadPartnersList(params)),
});

const connectedPartnersContainer = connect(mapStateToProps, mapDispatch)(PartnersContainer);
export default withRouter(connectedPartnersContainer);
