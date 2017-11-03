import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { browserHistory as history, withRouter } from 'react-router';
import MainContentWrapper from '../../components/common/mainContentWrapper';
import HeaderNavigation from '../../components/common/headerNavigation';
import AgencyMembersFilter from './agencyMembersFilter';
import PaginatedList from '../common/list/paginatedList';
import TableWithStateInUrl from '../common/hoc/tableWithStateInUrl';
import { loadMembersList } from '../../reducers/agencyMembersList';
import { isQueryChanged } from '../../helpers/apiHelper';

class AgencyMembersContainer extends Component {
  componentWillMount() {
    const { query, agencyId } = this.props;
    this.props.loadMembers(agencyId, query);
  }

  shouldComponentUpdate(nextProps) {
    const { query, agencyId } = this.props;

    if (isQueryChanged(nextProps, query)) {
      this.props.loadMembers(agencyId, nextProps.location.query);
      return false;
    }

    return true;
  }

  render() {
    const { members, agencyName, columns, totalCount, loading } = this.props;

    return (
      <div>
        <Grid item>
          <HeaderNavigation title={agencyName} />
        </Grid>
        <MainContentWrapper>
          <Grid container direction="column" spacing={24}>
            <Grid item>
              <AgencyMembersFilter />
            </Grid>
            <Grid item>
              <TableWithStateInUrl
                component={PaginatedList}
                items={members}
                columns={columns}
                itemsCount={totalCount}
                loading={loading}
              />
            </Grid>
          </Grid>
        </MainContentWrapper>
      </div>
    );
  }
}

AgencyMembersContainer.propTypes = {
  members: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  totalCount: PropTypes.number.isRequired,
  loadMembers: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  agencyId: PropTypes.string,
  agencyName: PropTypes.string,
  query: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  members: state.agencyMembersList.members,
  totalCount: state.agencyMembersList.totalCount,
  columns: state.agencyMembersList.columns,
  loading: state.agencyMembersList.loading,
  query: ownProps.location.query,
  agencyId: state.session.agencyId,
  agencyName: state.session.agencyName,
});

const mapDispatch = dispatch => ({
  loadMembers: (agencyId, params) => dispatch(loadMembersList(agencyId, params)),
});

const connectedAgencyMembersContainer = connect(mapStateToProps, mapDispatch)(AgencyMembersContainer);
export default withRouter(connectedAgencyMembersContainer);
