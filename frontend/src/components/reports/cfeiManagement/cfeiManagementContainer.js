import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { withRouter } from 'react-router/lib';
import CfeiManagementFilter from './cfeiManagementFilter';
import PaginatedList from '../../common/list/paginatedList';
import TableWithStateInUrl from '../../common/hoc/tableWithStateInUrl';
import { loadCfeiReportsList } from '../../../reducers/reportsCfeiManagementList';
import { isQueryChanged } from '../../../helpers/apiHelper';

class CfeiManagementContainer extends Component {
  componentWillMount() {
    const { query } = this.props;
    this.props.loadReports(query);
  }

  shouldComponentUpdate(nextProps) {
    const { query } = this.props;

    if (isQueryChanged(nextProps, query)) {
      this.props.loadReports(nextProps.location.query);
      return false;
    }

    return true;
  }

  render() {
    const { items, columns, totalCount, loading } = this.props;

    return (
      <React.Fragment>
        <Grid container direction="column" spacing={24}>
          <Grid item>
            <CfeiManagementFilter />
          </Grid>
          <Grid item>
            <TableWithStateInUrl
              component={PaginatedList}
              items={items}
              columns={columns}
              itemsCount={totalCount}
              loading={loading}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

CfeiManagementContainer.propTypes = {
  items: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  totalCount: PropTypes.number.isRequired,
  loadReports: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  query: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  items: state.reportsCfeiManagementList.items,
  totalCount: state.reportsCfeiManagementList.totalCount,
  columns: state.reportsCfeiManagementList.columns,
  loading: state.reportsCfeiManagementList.loading,
  query: ownProps.location.query,
});

const mapDispatch = dispatch => ({
  loadReports: params => dispatch(loadCfeiReportsList(params)),
});

const connectedCfeiManagementContainer =
    connect(mapStateToProps, mapDispatch)(CfeiManagementContainer);
export default withRouter(connectedCfeiManagementContainer);
