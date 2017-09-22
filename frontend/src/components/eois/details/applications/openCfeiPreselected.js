import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PartnerProfileNameCell from '../../../partners/partnerProfileNameCell';
import SelectableList from '../../../common/list/selectableList';
import WithGreyColor from '../../../common/hoc/withGreyButtonStyle';
import Compare from '../../buttons/compareButton';
import PreselectedTotalScore from '../../cells/preselectedTotalScore';
import PreselectedYourScore from '../../cells/preselectedYourScore';

/* eslint-disable react/prop-types */
const HeaderActions = (props) => {
  const { rows } = props;
  const ids = rows.map(row => row.id);
  const CompareButton = WithGreyColor(Compare);
  return (
    <CompareButton id={ids} />
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
  } else if (column.name === 'yourScore') {
    return (<PreselectedYourScore
      id={row.id}
      score={row.yourScore}
    />);
  } else if (column.name === 'totalScore') {
    return (<PreselectedTotalScore
      id={row.id}
      score={row.totalScore}
      hovered={row.hovered}
    />);
  }
  return undefined;
};
/* eslint-enable react/prop-types */
const OpenCfeiPreselections = (props) => {
  const { applications, columns } = props;
  return (
    <div>
      <SelectableList
        items={applications}
        columns={columns}
        headerAction={HeaderActions}
        templateCell={applicationsCells}
        onPageSizeChange={pageSize => console.log('Page size', pageSize)}
        onCurrentPageChange={page => console.log('Page number', page)}
      />
    </div>
  );
};

OpenCfeiPreselections.propTypes = {
  applications: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  applications: state.partnersPreselectionList.preselections,
  columns: state.partnersPreselectionList.columns,
});


export default connect(mapStateToProps)(OpenCfeiPreselections);
