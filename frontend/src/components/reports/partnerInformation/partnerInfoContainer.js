import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TableCell } from 'material-ui/Table';
import { withRouter } from 'react-router';
import PartnerInfoFilter from './partnerInfoFilter';
import CustomGridColumn from '../../common/grid/customGridColumn';
import SelectableList from '../selectableList';
import { loadPartnerReportsList } from '../../../reducers/reportsPartnerInformationList';
import { isQueryChanged } from '../../../helpers/apiHelper';
import PartnerMapping from '../partnerMapping';


class PartnerInfoContainer extends Component {
  componentWillMount() {
    const { query } = this.props;
    this.props.loadReports(query);
  }

  componentWillReceiveProps(nextProps) {
    const { query } = this.props;

    if (isQueryChanged(nextProps, query)) {
      this.props.loadReports(nextProps.location.query);
    }
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
    if (column.name === 'no_of_offices') {
      return <TableCell>{row.offices.length}</TableCell>;
    }

    return <TableCell>{value}</TableCell>;
  }

  render() {
    const { items, columns, totalCount, loading } = this.props;

    return (
      <CustomGridColumn>
        <PartnerInfoFilter
          clearSelections={() => this.listRef.getWrappedInstance().getWrappedInstance().clearSelections()}
        />
        <PartnerMapping
          items={items}
          fieldName={'offices'}
        />
        <SelectableList
          innerRef={field => this.listRef = field}
          items={items}
          columns={columns}
          loading={loading}
          itemsCount={totalCount}
          templateCell={this.tableCell}
        />
      </CustomGridColumn>
    );
  }
}

PartnerInfoContainer.propTypes = {
  items: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  totalCount: PropTypes.number.isRequired,
  loadReports: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  query: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  items: state.reportsPartnerList.items,
  totalCount: state.reportsPartnerList.totalCount,
  columns: state.reportsPartnerList.columns,
  loading: state.reportsPartnerList.loading,
  query: ownProps.location.query,
});

const mapDispatch = dispatch => ({
  loadReports: params => dispatch(loadPartnerReportsList(params)),
});

const connectedPartnerInfoContainer =
connect(
  mapStateToProps,
  mapDispatch,
)(PartnerInfoContainer);

export default withRouter(connectedPartnerInfoContainer);
