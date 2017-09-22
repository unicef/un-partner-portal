import React from 'react';
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

const applicationsCells = ({ row, column }) => {
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
const PartnersContainer = (props) => {
  const { applications, columns } = props;
  return (
    <div>
      <GridColumn gutter={24}>
        <PartnerFilter />
        <SelectableList
          items={applications}
          columns={columns}
          headerAction={HeaderActions}
          templateCell={applicationsCells}
          onPageSizeChange={pageSize => console.log('Page size', pageSize)}
          onCurrentPageChange={page => console.log('Page number', page)}
        />
      </GridColumn>
    </div>
  );
};

PartnersContainer.propTypes = {
  applications: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  applications: state.partnersApplicationsList.applications,
  columns: state.partnersApplicationsList.columns,
});


export default connect(mapStateToProps)(PartnersContainer);
