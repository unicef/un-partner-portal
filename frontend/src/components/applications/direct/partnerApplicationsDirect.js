import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GridColumn from '../../common/grid/gridColumn';
import PartnerApplicationsDirectFilter from './partnerApplicationsDirectFilter';
import ConceptNoteIDCell from '../conceptNoteIDCell';
import PaginatedList from '../../common/list/paginatedList';
import { loadApplicationsDirect } from '../../../reducers/applicationsDirectList';
import { isQueryChanged } from '../../../helpers/apiHelper';
import { formatDateForPrint } from '../../../helpers/dates';
import WrappedCell from '../../common/cell/wrappedCell';

const applicationCell = ({ row, column }) => {
  if (column.name === 'submission_date') {
    return <WrappedCell content={formatDateForPrint(row.submission_date)} />;
  } else if (column.name === 'id') {
    return (<ConceptNoteIDCell
      id={row.id}
    />);
  }

  return undefined;
};

class PartnerApplicationsDirect extends Component {
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
    const { items, columns, itemsTotal, loading } = this.props;

    return (
      <GridColumn container direction="column" spacing={24}>
        <PartnerApplicationsDirectFilter />
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

PartnerApplicationsDirect.propTypes = {
  columns: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  itemsTotal: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  loadApplications: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  items: R.path(['direct'], state.applicationsDirectList) || [],
  itemsTotal: state.applicationsDirectList.totalCount,
  loading: state.applicationsDirectList.loading,
  query: ownProps.location.query,
  columns: state.applicationsDirectList.columns,
});

const mapDispatch = dispatch => ({
  loadApplications: params => dispatch(loadApplicationsDirect(params)),
});


export default connect(mapStateToProps, mapDispatch)(PartnerApplicationsDirect);
