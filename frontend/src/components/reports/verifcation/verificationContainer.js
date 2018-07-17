
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TableCell } from 'material-ui/Table';
import Grid from 'material-ui/Grid';
import { withRouter } from 'react-router';
import VerificationFilter from './verificationFilter';
import PaginatedList from '../../common/list/paginatedList';
import TableWithStateInUrl from '../../common/hoc/tableWithStateInUrl';
import { loadVerificationReportsList } from '../../../reducers/reportsVerificationList';
import { isQueryChanged } from '../../../helpers/apiHelper';
import PartnerNameCell from './partnerNameCell';

class VerificationContainer extends Component {
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

  /* eslint-disable class-methods-use-this */
  tableCell({ row, column, value }) {
    if (column.name === 'legal_name') {
      return (<PartnerNameCell
        isVerified={row.is_verified}
        flagInfo={row.flagging_status}
        legalName={row.legal_name}
      />);
    }

    return <TableCell>{value}</TableCell>;
  }

  render() {
    const { items, columns, totalCount, loading } = this.props;

    return (
      <React.Fragment>
        <Grid container direction="column" spacing={24}>
          <Grid item>
            <VerificationFilter />
          </Grid>
          <Grid item>
            <TableWithStateInUrl
              component={PaginatedList}
              items={items}
              columns={columns}
              itemsCount={totalCount}
              loading={loading}
              templateCell={this.tableCell}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

VerificationContainer.propTypes = {
  items: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  totalCount: PropTypes.number.isRequired,
  loadReports: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  query: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  items: state.reportVerificationList.items,
  totalCount: state.reportVerificationList.totalCount,
  columns: state.reportVerificationList.columns,
  loading: state.reportVerificationList.loading,
  query: ownProps.location.query,
});

const mapDispatch = dispatch => ({
  loadReports: params => dispatch(loadVerificationReportsList(params)),
});

const connectedVerificationContainer =
    connect(mapStateToProps, mapDispatch)(VerificationContainer);
export default withRouter(connectedVerificationContainer);