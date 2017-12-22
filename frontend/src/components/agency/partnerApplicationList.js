import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { TableCell } from 'material-ui/Table';
import CnCell from './cnCell';
import TitleCell from './titleCell';
import MainContentWrapper from '../../components/common/mainContentWrapper';
import PartnerApplicationListFilter from './partnerApplicationListFilter';
import PaginatedList from '../common/list/paginatedList';
import TableWithStateInUrl from '../common/hoc/tableWithStateInUrl';
import SectorsCell from './sectorsCell';
import { formatDateForPrint } from '../../helpers/dates';
import DirectSelectionCell from '../../components/applications/unsolicited/directSelectionCell';
import { loadPartnerApplications } from '../../reducers/agencyPartnerApplicationList';
import { isQueryChanged } from '../../helpers/apiHelper';
import CountriesCell from '../partners/countriesCell';

const applicationCell = ({ row, column }) => {
  if (column.name === 'specializations') {
    return <SectorsCell specializations={row.specializations} />;
  } else if (column.name === 'did_win') {
    return <DirectSelectionCell directSelection={row.did_win} />;
  } else if (column.name === 'created') {
    return (<TableCell>
      {formatDateForPrint(row.created)}
    </TableCell>);
  } else if (column.name === 'id') {
    return <CnCell type={row.cfei_type} cnId={`${row.id}`} eoiId={`${row.eoi_id}`} />;
  } else if (column.name === 'title') {
    return <TitleCell type={row.cfei_type} eoiId={`${row.eoi_id}`} title={row.title} />;
  } else if (column.name === 'country_code') {
    return <CountriesCell countries={row.country_code} />;
  }

  return undefined;
};

class AgencyMembersContainer extends Component {
  componentWillMount() {
    const { query, partner } = this.props;

    this.props.loadApplications(R.merge(query, { partner }));
  }

  shouldComponentUpdate(nextProps) {
    const { query, partner } = this.props;

    if (isQueryChanged(nextProps, query)) {
      this.props.loadApplications(R.merge(nextProps.location.query, { partner }));
      return false;
    }

    return true;
  }

  render() {
    const { applications, columns, totalCount, loading } = this.props;

    return (
      <MainContentWrapper>
        <Grid container direction="column" spacing={24}>
          <Grid item>
            <PartnerApplicationListFilter />
          </Grid>
          <Grid item>
            <TableWithStateInUrl
              component={PaginatedList}
              items={applications}
              columns={columns}
              itemsCount={totalCount}
              loading={loading}
              templateCell={applicationCell}
            />
          </Grid>
        </Grid>
      </MainContentWrapper>
    );
  }
}

AgencyMembersContainer.propTypes = {
  applications: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  totalCount: PropTypes.number.isRequired,
  loadApplications: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  partner: PropTypes.string,
  query: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  applications: state.agencyPartnerApplicationList.items,
  totalCount: state.agencyPartnerApplicationList.totalCount,
  columns: state.agencyPartnerApplicationList.columns,
  loading: state.agencyPartnerApplicationList.loading,
  query: ownProps.location.query,
  partner: ownProps.params.id,
});

const mapDispatch = dispatch => ({
  loadApplications: params => dispatch(loadPartnerApplications(params)),
});

const connectedAgencyMembersContainer =
connect(mapStateToProps, mapDispatch)(AgencyMembersContainer);
export default withRouter(connectedAgencyMembersContainer);
