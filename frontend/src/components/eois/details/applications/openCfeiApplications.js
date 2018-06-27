import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose, pluck, any } from 'ramda';
import withStyles from 'material-ui/styles/withStyles';
import { TableCell } from 'material-ui/Table';
import { browserHistory as history, withRouter } from 'react-router';
import OpenCfeiApplicationsFilter from '../../filters/openCfeiApplicationsFilter';
import PartnerProfileNameCell from '../../../partners/partnerProfileNameCell';
import SelectableList from '../../../common/list/selectableList';
import PaginatedList from '../../../common/list/paginatedList';
import TableWithStateInUrl from '../../../common/hoc/tableWithStateInUrl';
import GridColumn from '../../../common/grid/gridColumn';
import RejectButton from '../../buttons/rejectButton';
import PreselectButton from '../../buttons/preselectButton';
import OrganizationTypeCell from '../../../applications/organizationTypeCell';
import WithGreyColor from '../../../common/hoc/withGreyButtonStyle';
import ApplicationStatusCell from '../../cells/applicationStatusCell';
import ApplicationCnIdCell from '../../cells/applicationCnIdCell';
import { loadApplications } from '../../../../reducers/partnersApplicationsList';
import { isQueryChanged } from '../../../../helpers/apiHelper';
import {
  isCfeiCompleted,
  isUserAFocalPoint,
  selectCfeiStatus,
  isUserACreator,
} from '../../../../store';
import { PROJECT_STATUSES } from '../../../../helpers/constants';


/* eslint-disable react/prop-types */
const styleSheetHeader = () => ({
  container: {
    display: 'flex',
  },
});

const HeaderActionsBase = (props) => {
  const { classes, rows, changeDisabled } = props;
  
  const ids = rows.map(row => row.id);
  const anyReviewStarted = any(({ review_progress: progress }) => !progress.startsWith('0'), rows);
  const Preselect = WithGreyColor(changeDisabled)(PreselectButton);
  const Reject = WithGreyColor(anyReviewStarted || changeDisabled)(RejectButton);
  return (
    <div className={classes.container}>
      <Preselect id={ids} />
      <Reject id={ids} />
    </div>
  );
};

const mapStateToPropsForHeaderActions = (state, ownProps) => ({
  changeDisabled: selectCfeiStatus(state, ownProps.params.id) !== PROJECT_STATUSES.OPE,
  status: selectCfeiStatus(state, ownProps.params.id),
});

const HeaderActions = compose(
  withRouter,
  connect(mapStateToPropsForHeaderActions),
  withStyles(styleSheetHeader),
)(HeaderActionsBase);


const onTableRowClick = (row) => {
  const loc = history.getCurrentLocation().pathname;
  history.push(`${loc}/${row.id}`);
};


/* eslint-enable react/prop-types */
class ApplicationsListContainer extends Component {
  constructor() {
    super();
    this.applicationsCells = this.applicationsCells.bind(this);
  }
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

  applicationsCells({ row, column, hovered, value }) {
    const { changeDisabled } = this.props;

    if (column.name === 'legal_name') {
      return (<PartnerProfileNameCell
        info={row.partner_additional}
      />);
    } else if (column.name === 'id') {
      return (<ApplicationCnIdCell
        id={row.id}
      />
      );
    } else if (column.name === 'status') {
      return (<ApplicationStatusCell
        id={row.id}
        status={row.status}
        applicationStatus={row.application_status}
        conceptNote={row.cn}
        hovered={hovered}
        progress={row.review_progress}
        changeDisabled={changeDisabled}
      />
      );
    } else if (column.name === 'type_org') {
      return <OrganizationTypeCell orgType={row.type_org} />;
    }

    return <TableCell>{value}</TableCell>;
  }

  render() {
    const { applications, columns, loading, itemsCount, allowedToEdit } = this.props;

    return (
      <div>
        <GridColumn spacing={24}>
          <OpenCfeiApplicationsFilter />
          {allowedToEdit ?
            <SelectableList
              items={applications}
              columns={columns}
              loading={loading}
              itemsCount={itemsCount}
              headerAction={HeaderActions}
              templateCell={this.applicationsCells}
              onTableRowClick={onTableRowClick}
              clickableRow
            />
            : <TableWithStateInUrl
              component={PaginatedList}
              items={applications}
              columns={columns}
              loading={loading}
              itemsCount={itemsCount}
              templateCell={this.applicationsCells}
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
  id: PropTypes.string,
  allowedToEdit: PropTypes.bool,
  changeDisabled: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  applications: state.partnersApplicationsList.data.applications,
  itemsCount: state.partnersApplicationsList.data.itemsCount,
  columns: state.partnersApplicationsList.data.columns,
  loading: state.partnersApplicationsList.status.loading,
  query: ownProps.location.query,
  id: ownProps.params.id,
  changeDisabled: selectCfeiStatus(state, ownProps.params.id) !== PROJECT_STATUSES.OPE,
  allowedToEdit: !isCfeiCompleted(state, ownProps.params.id)
    && (isUserAFocalPoint(state, ownProps.params.id) || isUserACreator(state, ownProps.params.id)),
});

const mapDispatchToProps = dispatch => ({
  loadApplications: (id, query) => dispatch(loadApplications(id, query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationsListContainer);
