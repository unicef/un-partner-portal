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
import { isQueryChanged } from '../../../../helpers/apiHelper';

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
    const { applications, columns, loading, itemsCount } = this.props;
    return (
      <div>
        <SelectableList
          items={applications}
          itemsCount={itemsCount}
          columns={columns}
          loading={loading}
          headerAction={HeaderActions}
          templateCell={applicationsCells}
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
  query: PropTypes.object,
  itemsCount: PropTypes.number,
  id: PropTypes.number,
};

const mapStateToProps = (state, ownProps) => ({
  applications: state.partnersApplicationsList.applicationsList.applications,
  itemsCount: state.partnersApplicationsList.applicationsList.itemsCount,
  columns: state.partnersPreselectionList.columns,
  loading: state.partnersApplicationsList.status.loading,
  query: ownProps.location.query,
  id: ownProps.params.id,
});

const mapDispatchToProps = dispatch => ({
  loadApplications: (id, params) => dispatch(
    loadApplications(id, { ...params, status: APPLICATION_STATUSES.PRE })),
});


export default connect(mapStateToProps, mapDispatchToProps)(OpenCfeiPreselections);
