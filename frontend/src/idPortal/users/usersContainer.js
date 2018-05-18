import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { browserHistory as history, withRouter } from 'react-router';
import MainContentWrapper from '../../components/common/mainContentWrapper';
import HeaderNavigation from '../../components/common/headerNavigation';
import AgencyMembersFilter from './usersFilter';
import PaginatedList from '../../components/common/list/paginatedList';
import TableWithStateInUrl from '../../components/common/hoc/tableWithStateInUrl';
import { loadMembersList } from '../../reducers/agencyMembersList';
import { isQueryChanged } from '../../helpers/apiHelper';
import NewUserModalButton from './newUser/newUserModalButton';
import UserDetailsExpand from './userDetailsExpand';

class UsersContainer extends Component {
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
      <React.Fragment>
        <Grid item>
          <HeaderNavigation
            title="Users"
            header={<NewUserModalButton />}
          />
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
                expandedCell={row => <UserDetailsExpand partner={row} />}
              />
            </Grid>
          </Grid>
        </MainContentWrapper>
      </React.Fragment>
    );
  }
}

UsersContainer.propTypes = {
  members: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  totalCount: PropTypes.number.isRequired,
  loadMembers: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  agencyId: PropTypes.number,
  agencyName: PropTypes.string,
  query: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  members: state.agencyMembersList.members,
  totalCount: state.agencyMembersList.totalCount,
  columns: state.idPortalUsersList.columns,
  loading: state.agencyMembersList.loading,
  query: ownProps.location.query,
  agencyId: state.session.agencyId,
  agencyName: state.session.agencyName,
});

const mapDispatch = dispatch => ({
  loadMembers: (agencyId, params) => dispatch(loadMembersList(agencyId, params)),
});

const connectedUsersContainer = connect(mapStateToProps, mapDispatch)(UsersContainer);
export default withRouter(connectedUsersContainer);
