import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import PaginatedList from '../common/list/paginatedList';
import RenderProjectCells from './cells/tableCells';
import TableWithStateInUrl from '../common/hoc/tableWithStateInUrl';
import { PROJECT_TYPES, ROLES } from '../../helpers/constants';
import {
  openAgencyColumns,
  openPartnerColumns,
  directAgencyColumns,
  unsolicitedAgencyColumns,
  customColumns,
} from './tableColumns';

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

  render() {
    const { cfei, loading, role, type, count = 0 } = this.props;

    return (
      <Grid item>
        <TableWithStateInUrl
          component={PaginatedList}
          items={cfei}
          itemsCount={count}
          columns={CfeiTableContainer.getColumnData(role, type)}
          templateCell={RenderProjectCells(type)}
          loading={loading}
          customColumns={customColumns}
        />
      </Grid>
    );
  }
}

CfeiTableContainer.propTypes = {
  cfei: PropTypes.array,
  loading: PropTypes.bool,
  role: PropTypes.string,
  type: PropTypes.string,
  count: PropTypes.number,
};

const mapStateToProps = (state, ownProps) => ({
  role: state.session.role,
  cfei: state.cfei.cfei[ownProps.type],
  count: state.cfei.cfei[`${ownProps.type}Count`],
  loading: state.cfei.status.loading,
});

export default connect(
  mapStateToProps,
)(CfeiTableContainer);
