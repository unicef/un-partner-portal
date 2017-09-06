import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import Snackbar from 'material-ui/Snackbar';
import RegularTable from '../common/table/regularTable';
import {
  renderPartnerOpenCells,
  renderAgencyOpenCells,
  renderAgencyDirectCells,
} from './cells/tableCells';

import {
  openAgencyColumns,
  openPartnerColumns,
  directAgencyColumns,
} from './tableColumns';


class CfeiTableContainer extends Component {
  static getCellsRenderer(role, type) {
    if (role === 'partner'
      && (type === 'open' || type === 'pinned')) {
      return renderPartnerOpenCells;
    } else if (type === 'open') {
      return renderAgencyOpenCells;
    } else if (type === 'direct') {
      return renderAgencyDirectCells;
    }
    return () => null;
  }

  // should be moved to state but hold until new table is added
  static getColumnData(role, type) {
    if (role === 'partner'
      && (type === 'open' || type === 'pinned')) {
      return openPartnerColumns;
    } else if (type === 'open') {
      return openAgencyColumns;
    } else if (type === 'direct') {
      return directAgencyColumns;
    }
    return () => null;
  }

  constructor(props) {
    super(props);
    this.state = { alert: false };
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errorMsg) this.setState({ alert: true });
  }

  handleDialogClose() {
    this.setState({ alert: false });
  }

  render() {
    const { cfei, loading, errorMsg, role, type } = this.props;
    const { alert } = this.state;
    return (
      <Grid item>
        <RegularTable
          data={cfei}
          columnData={CfeiTableContainer.getColumnData(role, type)}
          renderTableCells={CfeiTableContainer.getCellsRenderer(role, type)}
          loading={loading}
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={alert}
          message={errorMsg}
          autoHideDuration={6e3}
          onRequestClose={this.handleDialogClose}
        />
      </Grid>
    );
  }
}

CfeiTableContainer.propTypes = {
  cfei: PropTypes.array,
  loading: PropTypes.bool,
  errorMsg: PropTypes.string,
  role: PropTypes.string,
  type: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  role: state.session.role,
  cfei: state.cfei.cfei[ownProps.type],
  loading: state.cfei.cfeiStatus.loading,
  errorMsg: state.cfei.cfeiStatus.error.message,
});

export default connect(
  mapStateToProps,
)(CfeiTableContainer);
