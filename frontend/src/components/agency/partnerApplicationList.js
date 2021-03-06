import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { TableCell } from 'material-ui/Table';
import Typography from 'material-ui/Typography';
import CnCell from './cnCell';
import PartnerApplicationListFilter from './partnerApplicationListFilter';
import PaginatedList from '../common/list/paginatedList';
import TableWithStateInUrl from '../common/hoc/tableWithStateInUrl';
import SectorsCell from './sectorsCell';
import { formatDateForPrint } from '../../helpers/dates';
import DirectSelectionCell from '../../components/applications/unsolicited/directSelectionCell';
import { loadPartnerApplications } from '../../reducers/agencyPartnerApplicationList';
import { isQueryChanged } from '../../helpers/apiHelper';
import CountriesCell from '../partners/countriesCell';
import CustomGridColumn from '../common/grid/customGridColumn';

const applicationCell = ({ row, column, value }) => {
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
    return <TableCell><Typography>{value}</Typography></TableCell >;
  } else if (column.name === 'country_code') {
    return <CountriesCell countries={row.country_code} />;
  }

  return <TableCell><Typography>{value}</Typography></TableCell>;
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
      <CustomGridColumn>
        <PartnerApplicationListFilter />
        <TableWithStateInUrl
          component={PaginatedList}
          items={applications}
          columns={columns}
          itemsCount={totalCount}
          loading={loading}
          templateCell={applicationCell}
        />
      </CustomGridColumn>
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
