import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { TableCell } from 'material-ui/Table';
import { withRouter } from 'react-router';
import MainContentWrapper from '../../../components/common/mainContentWrapper';
import HeaderNavigation from '../../../components/common/headerNavigation';
import PaginatedList from '../../../components/common/list/paginatedList';
import TableWithStateInUrl from '../../../components/common/hoc/tableWithStateInUrl';
import { loadMembersList } from '../../../reducers/partnerMembersList';
import { isQueryChanged } from '../../../helpers/apiHelper';

class PartnerUsersContainer extends Component {
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

  /* eslint-disable class-methods-use-this */
  tableCells({ row, column, hovered, value }) {
    if (column.name === 'name') {
      return <TableCell>{row.user.fullname}</TableCell>;
    } else if (column.name === 'email') {
      return <TableCell>{row.user.email}</TableCell>;
    }

    return <TableCell>{value}</TableCell>;
  }

  render() {
    const { items, columns, totalCount, loading } = this.props;

    return (
      <React.Fragment>
        <Grid container direction="column" spacing={24}>
          <Grid item>
            <TableWithStateInUrl
              component={PaginatedList}
              items={items}
              columns={columns}
              itemsCount={totalCount}
              loading={loading}
              templateCell={this.tableCells}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

PartnerUsersContainer.propTypes = {
  items: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  totalCount: PropTypes.number.isRequired,
  loadUsers: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  query: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  items: state.partnerMembersList.items,
  totalCount: state.partnerMembersList.totalCount,
  columns: state.partnerMembersList.columns,
  loading: state.partnerMembersList.loading,
  query: ownProps.location.query,
});

const mapDispatch = (dispatch, ownProps) => ({
  loadUsers: params => dispatch(loadMembersList(ownProps.params.id, params)),
});

const connectedUsersContainer = connect(mapStateToProps, mapDispatch)(PartnerUsersContainer);
export default withRouter(connectedUsersContainer);
