import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';
import PropTypes from 'prop-types';
import GridColumn from '../../common/grid/gridColumn';
import PartnerApplicationsNotesFilter from './partnerApplicationsUnsolicitedFilter';
import DirectSelectionCell from './directSelectionCell';
import ConceptNoteIDCell from '../conceptNoteIDCell';
import PaginatedList from '../../common/list/paginatedList';
import { loadApplicationsUcn } from '../../../reducers/applicationsUnsolicitedList';
import { isQueryChanged } from '../../../helpers/apiHelper';
import { formatDateForPrint } from '../../../helpers/dates';
import WrappedCell from '../../common/cell/wrappedCell';
import SectorsCell from '../sectorsCell';
import { PROJECT_TYPES } from '../../../helpers/constants';

/* eslint-disable react/prop-types */
const applicationCell = ({ row, column }) => {
  if (column.name === 'is_direct') {
    return (<DirectSelectionCell
      directSelection={row.is_direct}
    />);
  } else if (column.name === 'submission_date') {
    return <WrappedCell content={formatDateForPrint(row.submission_date)} />;
  } else if (column.name === 'id') {
    return (<ConceptNoteIDCell
      cfeiId={row.eoi_id}
      id={row.id}
      type={PROJECT_TYPES.UNSOLICITED}
    />);
  } else if (column.name === 'specializations') {
    return <SectorsCell specializations={row.specializations} />;
  }

  return undefined;
};

class PartnerApplicationsUnsolicited extends Component {
  componentWillMount() {
    const { query } = this.props;
    this.props.loadApplications(query);
  }

  shouldComponentUpdate(nextProps) {
    const { query } = this.props;

    if (isQueryChanged(nextProps, query)) {
      this.props.loadApplications(nextProps.location.query);
      return false;
    }

    return true;
  }

  render() {
    const { columns, items, loading, itemsTotal } = this.props;

    return (
      <GridColumn spacing={24}>
        <PartnerApplicationsNotesFilter />
        <PaginatedList
          items={items}
          columns={columns}
          loading={loading}
          itemsCount={itemsTotal}
          templateCell={applicationCell}
        />
      </GridColumn>
    );
  }
}

PartnerApplicationsUnsolicited.propTypes = {
  columns: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  itemsTotal: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  loadApplications: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  items: R.path(['unsolicited'], state.applicationsUnsolicitedList) || [],
  itemsTotal: state.applicationsUnsolicitedList.totalCount,
  loading: state.applicationsUnsolicitedList.loading,
  query: ownProps.location.query,
  columns: state.applicationsUnsolicitedList.columns,
});

const mapDispatch = dispatch => ({
  loadApplications: params => dispatch(loadApplicationsUcn(params)),
});

export default connect(mapStateToProps, mapDispatch)(PartnerApplicationsUnsolicited);
