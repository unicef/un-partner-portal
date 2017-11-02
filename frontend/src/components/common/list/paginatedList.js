import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory as history, withRouter } from 'react-router';
import { Grid, TableView, TableHeaderRow, TableRowDetail, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import { withStyles } from 'material-ui/styles';
import { PagingState, SortingState, RowDetailState } from '@devexpress/dx-react-grid';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import ListLoader from './listLoader';
import { calculatePaginatedPage, updatePageNumberSize, updatePageNumber } from '../../../helpers/apiHelper';

const table = {
  allowedPageSizes: [5, 10, 15],
};

const styleSheet = (theme) => {
  const paddingSmall = theme.spacing.unit * 3;
  const paddingMedium = theme.spacing.unit * 4;

  return {
    container: {
      padding: `${paddingSmall}px 0 ${paddingSmall}px ${paddingMedium}px`,
      backgroundColor: theme.palette.primary[100],
    },
  };
};

class PaginatedList extends Component {
  constructor(props) {
    super(props);
    this.state = { sorting: [{ columnName: 'title', direction: 'desc' }] };
    this.changeExpandedDetails = expandedRows => this.setState({ expandedRows });
    this.onPageSize = this.onPageSize.bind(this);
    this.changeSorting = this.changeSorting.bind(this);
  }

  componentWillMount() {
    const { pathName, query } = this.props;

    history.push({
      pathname: pathName,
      query: R.merge(query, { page: 1, page_size: 10 }),
    });
  }

  onPageSize(pageSize) {
    const { pageNumber, itemsCount, pathName, query } = this.props;

    updatePageNumberSize(calculatePaginatedPage(pageNumber, pageSize, itemsCount),
      pageSize, pathName, query);
  }

  navigationHeader() {
    const { classes, itemsCount, pageSize, pageNumber } = this.props;

    const firstRange = (pageSize * (pageNumber - 1)) + 1;
    const secondTmp = (pageSize * (pageNumber));

    const secondRange = secondTmp > itemsCount ? itemsCount : secondTmp;

    return (<div className={classes.container}><Typography type="title">
      {`${firstRange}-${secondRange} of ${itemsCount} results to show`}
    </Typography></div>);
  }

  changeSorting(sorting) {
    this.setState({
      sorting,
    });
  }

  render() {
    const { items, columns, templateCell, expandable, expandedCell,
      itemsCount, pageSize, pageNumber, loading, pathName, query } = this.props;

    return (
      <ListLoader
        loading={loading}
      >
        <Grid
          rows={items}
          columns={columns}
          headerPlaceholderTemplate={() => this.navigationHeader()}
        >
          <SortingState
            sorting={this.state.sorting}
            onSortingChange={this.changeSorting}
          />
          <PagingState
            currentPage={pageNumber - 1}
            pageSize={pageSize}
            onPageSizeChange={(size) => { this.onPageSize(size); }}
            onCurrentPageChange={(page) => { updatePageNumber(page, pathName, query); }}
            totalCount={itemsCount}
          />

          {expandable &&
          <RowDetailState onExpandedRowsChange={this.changeExpandedDetails} />}

          <TableView
            tableCellTemplate={templateCell}
          />
          <TableHeaderRow allowSorting />

          {expandable &&
          <TableRowDetail template={({ row }) => expandedCell(row)} />}

          <PagingPanel
            allowedPageSizes={table.allowedPageSizes}
          />
        </Grid>
      </ListLoader>
    );
  }
}

PaginatedList.propTypes = {
  classes: PropTypes.object.isRequired,
  itemsCount: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  templateCell: PropTypes.func.isRequired,
  expandable: PropTypes.bool,
  expandedCell: PropTypes.func,
  loading: PropTypes.bool,
  pageSize: PropTypes.number.isRequired,
  pageNumber: PropTypes.number.isRequired,
  pathName: PropTypes.string.isRequired,
  query: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  pathName: ownProps.location.pathname,
  query: ownProps.location.query,
  pageSize: ownProps.location.query.page_size,
  pageNumber: ownProps.location.query.page,
});

const connectedPaginatedList = connect(mapStateToProps, null)(PaginatedList);
const withRouterPaginatedList = withRouter(connectedPaginatedList);
export default withStyles(styleSheet, { name: 'PaginatedList' })(withRouterPaginatedList);
