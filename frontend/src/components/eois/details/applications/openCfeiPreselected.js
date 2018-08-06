import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { reject } from 'ramda';
import { browserHistory as history } from 'react-router';
import { TableCell } from 'material-ui/Table';
import PartnerProfileNameCell from '../../../partners/partnerProfileNameCell';
import ApplicationCnIdCell from '../../cells/applicationCnIdCell';
import SelectableList from '../../../common/list/selectableList';
import PaginatedList from '../../../common/list/paginatedList';
import TableWithStateInUrl from '../../../common/hoc/tableWithStateInUrl';
import WithGreyColor from '../../../common/hoc/withGreyButtonStyle';
import Compare from '../../buttons/compareButton';
import OrganizationTypeCell from '../../../applications/organizationTypeCell';
import PreselectedTotalScore from '../../cells/preselectedTotalScore';
import PreselectedYourScore from '../../cells/preselectedYourScore';
import { loadApplications } from '../../../../reducers/partnersApplicationsList';
import { APPLICATION_STATUSES } from '../../../../helpers/constants';
import { isQueryChanged } from '../../../../helpers/apiHelper';
import {
  isCfeiCompleted,
  isUserAFocalPoint,
  isUserAReviewer,
  isUserACreator,
} from '../../../../store';

/* eslint-disable react/prop-types */
const HeaderActions = (props) => {
  const { rows } = props;
  const CompareButton = WithGreyColor()(Compare);
  return (
    <CompareButton rows={rows} />
  );
};

const onTableRowClick = (row) => {
  const loc = history.getCurrentLocation().pathname;
  history.push(`${loc}/${row.id}`);
};

/* eslint-enable react/prop-types */
class OpenCfeiPreselections extends Component {
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
    if (column.name === 'legal_name') {
      return (<PartnerProfileNameCell
        info={row.partner_additional}
      />);
    } else if (column.name === 'id') {
      return (<ApplicationCnIdCell
        id={row.id}
      />
      );
    } else if (column.name === 'your_score') {
      return (<PreselectedYourScore
        id={row.id}
        score={row.your_score}
        breakdown={row.your_score_breakdown}
      />);
    } else if (column.name === 'average_total_score') {
      return (<PreselectedTotalScore
        id={row.id}
        conceptNote={row.cn}
        score={row.average_total_score}
        hovered={hovered}
        allowedToEdit={this.props.allowedToEdit}
      />);
    } else if (column.name === 'type_org') {
      return <OrganizationTypeCell orgType={row.type_org} />;
    }

    return <TableCell>{value}</TableCell>;
  }

  render() {
    const { applications, columns, loading, itemsCount, allowedToEdit, isReviewer } = this.props;
    let finalColumns = columns;
    if (!allowedToEdit) {
      finalColumns = reject(column => column.name === 'average_total_score', finalColumns);
    }
    if (!isReviewer) {
      finalColumns = reject(column => column.name === 'your_score', finalColumns);
    }
    return (
      <div>
        {allowedToEdit ?
          <SelectableList
            items={applications}
            columns={finalColumns}
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
            columns={finalColumns}
            loading={loading}
            itemsCount={itemsCount}
            templateCell={this.applicationsCells}
            onTableRowClick={onTableRowClick}
            clickableRow
          />}
      </div>
    );
  }
}

OpenCfeiPreselections.propTypes = {
  applications: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  loadApplications: PropTypes.func,
  loading: PropTypes.bool,
  query: PropTypes.object,
  itemsCount: PropTypes.number,
  id: PropTypes.string,
  allowedToEdit: PropTypes.bool,
  isReviewer: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  applications: state.partnersApplicationsList.data.applications,
  itemsCount: state.partnersApplicationsList.data.itemsCount,
  columns: state.partnersPreselectionList.columns,
  loading: state.partnersApplicationsList.status.loading,
  query: ownProps.location.query,
  id: ownProps.params.id,
  allowedToEdit: !isCfeiCompleted(state, ownProps.params.id)
    && (isUserAFocalPoint(state, ownProps.params.id) || isUserACreator(state, ownProps.params.id)),
  isReviewer: isUserAReviewer(state, ownProps.params.id),
});

const mapDispatchToProps = dispatch => ({
  loadApplications: (id, params) => dispatch(
    loadApplications(id, { ...params, status: APPLICATION_STATUSES.PRE })),
});


export default connect(mapStateToProps, mapDispatchToProps)(OpenCfeiPreselections);
