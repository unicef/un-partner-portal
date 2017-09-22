import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PartnerFilter from '../../../partners/partnerFilter';
import PartnerProfileNameCell from '../../../partners/partnerProfileNameCell';
import SelectableList from '../../../common/list/selectableList';
import GridColumn from '../../../common/grid/gridColumn';
import RejectButton from '../../buttons/rejectButton';
import PreselectButton from '../../buttons/preselectButton';
import GridRow from '../../../common/grid/gridRow';
import WithGreyColor from '../../../common/hoc/withGreyButtonStyle';
import ApplicationStatusCell from '../../cells/applicationStatusCell';
import { loadApplications } from '../../../../reducers/partnersApplicationsList';

/* eslint-disable react/prop-types */
const HeaderActions = (props) => {
  const { rows } = props;
  const ids = rows.map(row => row.id);
  const Preselect = WithGreyColor(PreselectButton);
  const Reject = WithGreyColor(RejectButton);
  return (
    <GridRow gutter={0}>
      <Preselect id={ids} />
      <Reject id={ids} />
    </GridRow>
  );
};

const applicationsCells = (row, column) => {
  if (column.name === 'name') {
    return (<PartnerProfileNameCell
      verified={row.verified}
      yellowFlag={row.flagYellow}
      redFlag={row.flagRed}
      name={row.name}
    />);
  }
  if (column.name === 'status') {
    return (<ApplicationStatusCell
      id={row.id}
      status={row.status}
      conceptNoteId={row.conceptNote}
      hovered={row.hovered}
    />
    );
  }
  return undefined;
};
/* eslint-enable react/prop-types */
class ApplicationsListContainer extends Component {
  componentWillMount() {
    this.props.loadApplications();
  }

  render() {
    const { applications, columns, loading } = this.props;
    return (
      <div>
        <GridColumn gutter={24}>
          <PartnerFilter />
          <SelectableList
            items={applications}
            columns={columns}
            loading={loading}
            headerAction={HeaderActions}
            templateCell={(row, column, style) => applicationsCells(row, column, style)}
            onPageSizeChange={pageSize => console.log('Page size', pageSize)}
            onCurrentPageChange={page => console.log('Page number', page)}
          />
        </GridColumn>
      </div>
    );
  }
}

ApplicationsListContainer.propTypes = {
  applications: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  loadApplications: PropTypes.func,
  loading: PropTypes.bool,
};

const mapStateToProps = state => ({
  applications: state.partnersApplicationsList.applicationsList.applications,
  columns: state.partnersApplicationsList.applicationsList.columns,
  loading: state.partnersApplicationsList.status.loading,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadApplications: () => dispatch(loadApplications(ownProps.params.id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationsListContainer);
