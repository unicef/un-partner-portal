import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { TableCell } from 'material-ui/Table';
import PaginatedList from '../../../../common/list/paginatedList';
import TableWithStateInUrl from '../../../../common/hoc/tableWithStateInUrl';
import { formatDateForPrint } from '../../../../../helpers/dates';
import { loadPartnerFlags } from '../../../../../reducers/agencyPartnerObservationsList';
import { isQueryChanged } from '../../../../../helpers/apiHelper';
import CustomGridColumn from '../../../../common/grid/customGridColumn';
import ObservationTypeIcon from '../../icons/observationTypeIcon';
import ObservationExpand from './observationExpand';
import PartnerObservationsListFilter from './partnerObservationsListFilter';

const messages = {
  me: ' (me)',
};

class PartnerObservationsList extends Component {
  constructor(props) {
    super(props);

    this.applicationCell = this.applicationCell.bind(this);
    this.submitterCell = this.submitterCell.bind(this);
  }
  componentWillMount() {
    const { query } = this.props;

    this.props.getFlags(query);
  }

  shouldComponentUpdate(nextProps) {
    const { query } = this.props;

    if (isQueryChanged(nextProps, query)) {
      this.props.getFlags(nextProps.location.query);
      return false;
    }

    return true;
  }

  /* eslint-disable class-methods-use-this */
  submitterCell(submitter) {
    const { userId } = this.props;

    return <TableCell>{submitter.name} {userId === submitter.id ? messages.me : null}, {submitter.agency_name}</TableCell>;
  }

  /* eslint-disable class-methods-use-this */
  applicationCell({ row, column, value }) {
    if (column.name === 'submitter') {
      return this.submitterCell(row.submitter);
    } else if (column.name === 'modified') {
      return (<TableCell>
        {formatDateForPrint(row.modified)}
      </TableCell>);
    } else if (column.name === 'flag_type') {
      return <TableCell>{ObservationTypeIcon(row.flag_type)}</TableCell>;
    } else if (column.name === ' submitter') {
      return this.submitterCell(row.submitter);
    }

    return <TableCell>{value}</TableCell>;
  }

  render() {
    const { applications, columns, totalCount, loading } = this.props;

    return (
      <CustomGridColumn>
        <PartnerObservationsListFilter />
        <TableWithStateInUrl
          component={PaginatedList}
          items={applications}
          columns={columns}
          itemsCount={totalCount}
          loading={loading}
          templateCell={this.applicationCell}
          expandable
          expandedCell={row => <ObservationExpand observation={row} />}
        />
      </CustomGridColumn>
    );
  }
}

PartnerObservationsList.propTypes = {
  applications: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  totalCount: PropTypes.number.isRequired,
  getFlags: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  partner: PropTypes.string,
  query: PropTypes.object,
  userId: PropTypes.number,
};

const mapStateToProps = (state, ownProps) => ({
  applications: state.partnerObservationsList.items,
  totalCount: state.partnerObservationsList.totalCount,
  columns: state.partnerObservationsList.columns,
  loading: state.partnerObservationsList.loading,
  query: ownProps.location.query,
  partner: ownProps.params.id,
  userId: state.session.userId,
});

const mapDispatch = (dispatch, ownProps) => ({
  getFlags: params => dispatch(loadPartnerFlags(ownProps.params.id, params)),
});

const connectedPartnerObservationsList =
  connect(mapStateToProps, mapDispatch)(PartnerObservationsList);
export default withRouter(connectedPartnerObservationsList);
