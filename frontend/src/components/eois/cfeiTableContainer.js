import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import Snackbar from 'material-ui/Snackbar';
import PaginatedList from '../common/list/paginatedList';
import RenderProjectCells from './cells/tableCells';
import { PROJECT_TYPES, ROLES} from '../../helpers/constants';
import {
  openAgencyColumns,
  openPartnerColumns,
  directAgencyColumns,
  unsolicitedAgencyColumns,
} from './tableColumns';
import { errorToBeCleared } from '../../reducers/cfeiStatus';

const { OPEN, DIRECT, PINNED, UNSOLICITED } = PROJECT_TYPES;
const { PARTNER } = ROLES;

class CfeiTableContainer extends Component {
  // should be moved to state but hold until new table is added
  static getColumnData(role, type) {
    if (role === PARTNER
      && (type === OPEN || type === PINNED)) {
      return openPartnerColumns;
    } else if (type === OPEN) {
      return openAgencyColumns;
    } else if (type === DIRECT) {
      return directAgencyColumns;
    } else if (type === UNSOLICITED) {
      return unsolicitedAgencyColumns;
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
    this.props.clearError();
  }

  render() {
    const { cfei, loading, errorMsg, role, type, count } = this.props;
    const { alert } = this.state;
    return (
      <Grid item>
        <PaginatedList
          items={cfei}
          itemsCount={count}
          columns={CfeiTableContainer.getColumnData(role, type)}
          templateCell={RenderProjectCells(type)}
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
  clearError: PropTypes.func,
  count: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  role: state.session.role,
  cfei: state.cfei.cfei[ownProps.type],
  count: state.cfei.cfei[`${ownProps.type}Count`],
  loading: state.cfei.cfeiStatus.loading,
  errorMsg: state.cfei.cfeiStatus.error.message,
});

const mapDispatchToProps = dispatch => ({
  clearError: () => dispatch(errorToBeCleared()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CfeiTableContainer);
