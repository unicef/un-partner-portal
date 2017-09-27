import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory as history, withRouter } from 'react-router';
import { Grid, TableView, TableHeaderRow, TableRowDetail, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import { withStyles } from 'material-ui/styles';
import { PagingState, RowDetailState } from '@devexpress/dx-react-grid';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { CircularProgress } from 'material-ui';

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
    loaderBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    loaderIcon: {
      position: 'absolute',
      fontSize: '20px',
      top: 'calc(50% - 10px)',
      left: 'calc(50% - 10px)',
    },
  };
};

class PaginatedList extends Component {
  constructor(props) {
    super(props);

    this.changeExpandedDetails = expandedRows => this.setState({ expandedRows });
    this.onPageChange = this.onPageChange.bind(this);
    this.onPageSize = this.onPageSize.bind(this);
  }

  componentWillMount() {
    const { pathName, query } = this.props;

    history.push({
      pathname: pathName,
      query: R.merge(query, { page: 1, page_size: 10 }),
    });
  }

  onPageChange(pageNumber) {
    this.updatePageNumber(pageNumber);
  }

  onPageSize(pageSize) {
    const { pageNumber, itemsCount } = this.props;

    const totalPages = Math.ceil(itemsCount / pageSize);
    const currentPage = Math.min(pageNumber, totalPages - 1);

    this.updatePageNumberSize(currentPage, pageSize);
  }

  updatePageNumberSize(pageNumber, pageSize) {
    const { pathName, query } = this.props;

    history.push({
      pathname: pathName,
      query: R.merge(query, { page: pageNumber + 1, page_size: pageSize }),
    });
  }

  updatePageNumber(pageNumber) {
    const { pathName, query } = this.props;

    history.push({
      pathname: pathName,
      query: R.merge(query, { page: pageNumber + 1 }),
    });
  }

  listLoader() {
    const { classes, loading } = this.props;

    return (loading && <div className={classes.loaderBg}>
      <CircularProgress color="accent" className={classes.loaderIcon} />
    </div>);
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

  render() {
    const { items, columns, templateCell, expandable, expandedCell, itemsCount, pageSize, pageNumber } = this.props;

    return (
      <div style={{ position: 'relative' }}>
        <Grid
          rows={items}
          columns={columns}
          headerPlaceholderTemplate={() => this.navigationHeader()}
        >
          <PagingState
            currentPage={pageNumber - 1}
            pageSize={pageSize}
            onPageSizeChange={(size) => { this.onPageSize(size); }}
            onCurrentPageChange={(page) => { this.onPageChange(page); }}
            totalCount={itemsCount}
          />

          {expandable &&
          <RowDetailState onExpandedRowsChange={this.changeExpandedDetails} />}

          <TableView
            tableCellTemplate={templateCell}
          />
          <TableHeaderRow />

          {expandable &&
          <TableRowDetail template={({ row }) => expandedCell(row)} />}

          <PagingPanel
            allowedPageSizes={table.allowedPageSizes}
          />
        </Grid>
        {this.listLoader()}
      </div>
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
