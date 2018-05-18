import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { browserHistory as history, withRouter } from 'react-router';
import MainContentWrapper from '../../../components/common/mainContentWrapper';
import HeaderNavigation from '../../../components/common/headerNavigation';
import AgencyMembersFilter from './usersFilter';
import PaginatedList from '../../../components/common/list/paginatedList';
import TableWithStateInUrl from '../../../components/common/hoc/tableWithStateInUrl';
import { loadUsersList } from '../../reducers/usersList';
import { isQueryChanged } from '../../../helpers/apiHelper';
import NewUserModalButton from './../newUser/newUserModalButton';
import UserDetailsExpand from './userDetailsExpand';
import UserStatusCell from './userStatusCell';

const tableCells = ({ row, column, hovered }) => {
  if (column.name === 'status') {
    return (<UserStatusCell
      hovered={hovered}
      status={row.status}
    />);
  }

  return undefined;
};

class UsersContainer extends Component {
  componentWillMount() {
    const { query } = this.props;
    this.props.loadUsers(query);
  }

  shouldComponentUpdate(nextProps) {
    const { query } = this.props;

    if (isQueryChanged(nextProps, query)) {
      this.props.loadUsers(nextProps.location.query);
      return false;
    }

    return true;
  }

  render() {
    const { members, columns, totalCount, loading } = this.props;

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
                expandable
                templateCell={tableCells}
                expandedCell={row => <UserDetailsExpand user={row} />}
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
  loadUsers: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  agencyName: PropTypes.string,
  query: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  members: state.idPortalUsersList.users,
  totalCount: state.idPortalUsersList.totalCount,
  columns: state.idPortalUsersList.columns,
  loading: state.idPortalUsersList.loading,
  query: ownProps.location.query,
  agencyId: state.session.agencyId,
  agencyName: state.session.agencyName,
});

const mapDispatch = dispatch => ({
  loadUsers: params => dispatch(loadUsersList(params)),
});

const connectedUsersContainer = connect(mapStateToProps, mapDispatch)(UsersContainer);
export default withRouter(connectedUsersContainer);
