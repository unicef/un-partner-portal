import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { browserHistory as history } from 'react-router';
import PartnerFilter from '../../../partners/partnerFilter';
import PartnerProfileNameCell from '../../../partners/partnerProfileNameCell';
import SelectableList from '../../../common/list/selectableList';
import PaginatedList from '../../../common/list/paginatedList';
import TableWithStateInUrl from '../../../common/hoc/tableWithStateInUrl';
import GridColumn from '../../../common/grid/gridColumn';
import RejectButton from '../../buttons/rejectButton';
import PreselectButton from '../../buttons/preselectButton';
import GridRow from '../../../common/grid/gridRow';
import WithGreyColor from '../../../common/hoc/withGreyButtonStyle';
import ApplicationStatusCell from '../../cells/applicationStatusCell';
import ApplicationCnIdCell from '../../cells/applicationCnIdCell';
import { loadApplications } from '../../../../reducers/partnersApplicationsList';
import { isQueryChanged } from '../../../../helpers/apiHelper';
import {
  isCfeiCompleted,
  isUserAFocalPoint,
  isUserACreator,
} from '../../../../store';

/* eslint-disable react/prop-types */
const HeaderActions = (props) => {
  const { rows } = props;
  const ids = rows.map(row => row.id);
  const Preselect = WithGreyColor()(PreselectButton);
  const Reject = WithGreyColor()(RejectButton);
  return (
    <div>
      <Preselect id={ids} />
      <Reject id={ids} />
    </div>
  );
};

const onTableRowClick = (row) => {
  const loc = history.getCurrentLocation().pathname;
  history.push(`${loc}/${row.id}`);
};

const applicationsCells = ({ row, column, hovered }) => {
  if (column.name === 'name') {
    return (<PartnerProfileNameCell
      verified={row.partner_additional.is_verified}
      flags={row.partner_additional.flagging_status}
      name={row.name}
    />);
  }
  if (column.name === 'id') {
    return (<ApplicationCnIdCell
      id={row.id}
    />
    );
  }
  if (column.name === 'status') {
    return (<ApplicationStatusCell
      id={row.id}
      status={row.status}
      conceptNote={row.cn}
      hovered={hovered}
      progress={row.review_progress}
    />
    );
  }
  return undefined;
};
/* eslint-enable react/prop-types */
class ApplicationsListContainer extends Component {
  componentWillMount() {
    const { id, query } = this.props;
    this.props.loadApplications(id, query);
  }

  shouldComponentUpdate(nextProps) {
    const { id, query } = this.props;

    if (isQueryChanged(nextProps, query)) {
      this.props.loadApplications(id, nextProps.location.query);
      return false;
    }
    return true;
  }

  render() {
    const { applications, columns, loading, itemsCount, allowedToEdit } = this.props;
    return (
      <div>
        <GridColumn spacing={24}>
          <PartnerFilter />
          {allowedToEdit ?
            <SelectableList
              items={applications}
              columns={columns}
              loading={loading}
              itemsCount={itemsCount}
              headerAction={HeaderActions}
              templateCell={applicationsCells}
              onTableRowClick={onTableRowClick}
              clickableRow
            />
            : <TableWithStateInUrl
              component={PaginatedList}
              items={applications}
              columns={columns}
              loading={loading}
              itemsCount={itemsCount}
              templateCell={applicationsCells}
              onTableRowClick={onTableRowClick}
              clickableRow
            />}
        </GridColumn>
      </div>
    );
  }
}

ApplicationsListContainer.propTypes = {
  applications: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  itemsCount: PropTypes.number,
  loadApplications: PropTypes.func,
  loading: PropTypes.bool,
  query: PropTypes.object,
  id: PropTypes.number,
  allowedToEdit: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  applications: state.partnersApplicationsList.applicationsList.applications,
  itemsCount: state.partnersApplicationsList.applicationsList.itemsCount,
  columns: state.partnersApplicationsList.applicationsList.columns,
  loading: state.partnersApplicationsList.status.loading,
  query: ownProps.location.query,
  id: ownProps.params.id,
  allowedToEdit: !isCfeiCompleted(state, ownProps.params.id)
    && (isUserAFocalPoint(state, ownProps.params.id) || isUserACreator(state, ownProps.params.id)),
});

const mapDispatchToProps = dispatch => ({
  loadApplications: (id, query) => dispatch(loadApplications(id, query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationsListContainer);
