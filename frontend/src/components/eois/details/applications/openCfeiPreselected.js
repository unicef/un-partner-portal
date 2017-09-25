import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PartnerProfileNameCell from '../../../partners/partnerProfileNameCell';
import SelectableList from '../../../common/list/selectableList';
import WithGreyColor from '../../../common/hoc/withGreyButtonStyle';
import Compare from '../../buttons/compareButton';
import PreselectedTotalScore from '../../cells/preselectedTotalScore';
import PreselectedYourScore from '../../cells/preselectedYourScore';
import { loadApplications } from '../../../../reducers/partnersApplicationsList';
import { APPLICATION_STATUSES } from '../../../../helpers/constants';

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
  } else if (column.name === 'your_score') {
    return (<PreselectedYourScore
      id={row.id}
      score={row.your_score}
    />);
  } else if (column.name === 'total_score') {
    return (<PreselectedTotalScore
      id={row.id}
      conceptNote={row.cn}
      score={row.total_score}
      hovered={row.hovered}
    />);
  }
  return undefined;
};
/* eslint-enable react/prop-types */
class OpenCfeiPreselections extends Component {
  componentWillMount() {
    this.props.loadApplications();
  }

  render() {
    const { applications, columns, loading } = this.props;
    return (
      <div>
        <SelectableList
          items={applications}
          columns={columns}
          loading={loading}
          headerAction={HeaderActions}
          templateCell={applicationsCells}
          onPageSizeChange={pageSize => console.log('Page size', pageSize)}
          onCurrentPageChange={page => console.log('Page number', page)}
        />
      </div>
    );
  }
}

OpenCfeiPreselections.propTypes = {
  applications: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  loadApplications: PropTypes.func,
  loading: PropTypes.bool,
};

const mapStateToProps = state => ({
  applications: state.partnersApplicationsList.applicationsList.applications,
  columns: state.partnersPreselectionList.columns,
  loading: state.partnersApplicationsList.status.loading,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadApplications: () => dispatch(loadApplications(
    ownProps.params.id,
    { status: APPLICATION_STATUSES.PRE })),
});


export default connect(mapStateToProps, mapDispatchToProps)(OpenCfeiPreselections);
