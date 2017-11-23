import React, { Component } from 'react';
import { Grid, TableView, TableHeaderRow, TableRowDetail, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import { withStyles } from 'material-ui/styles';
import { PagingState, SortingState, RowDetailState } from '@devexpress/dx-react-grid';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import ListLoader from './listLoader';

const table = {
  allowedPageSizes: [5, 10, 15],
};

const styleSheet = (theme) => {
  const paddingSmall = theme.spacing.unit * 3;

  return {
    container: {
      padding: `${paddingSmall}px 0 ${paddingSmall}px ${paddingSmall}px`,
    },
  };
};

class PaginatedList extends Component {
  constructor(props) {
    super(props);
    this.changeExpandedDetails = expandedRows => this.setState({ expandedRows });
  }

  navigationHeader() {
    const { classes, itemsCount, pageSize, pageNumber } = this.props;
    const firstRange = (pageSize * (pageNumber - 1)) + 1;
    const secondTmp = (pageSize * (pageNumber));
    const secondRange = secondTmp > itemsCount ? itemsCount : secondTmp;
    return (<div className={classes.container}><Typography type="title">
      {`${firstRange}-${secondRange} of ${itemsCount} results`}
    </Typography></div>);
  }

  changeSorting(sorting) {
    this.setState({
      sorting,
    });
  }

  render() {
    const { items,
      columns,
      templateCell,
      expandable,
      expandedCell,
      itemsCount,
      pageSize,
      pageNumber,
      loading,
      sorting,
      allowSorting,
      changeSorting,
      changePageSize,
      changePageNumber } = this.props;
    return (
      <ListLoader
        loading={loading}
      >
        <Grid
          rows={items}
          columns={columns}
          headerPlaceholderTemplate={() => this.navigationHeader()}
        >
          {allowSorting && <SortingState
            sorting={sorting}
            onSortingChange={changeSorting}
          /> }
          <PagingState
            currentPage={pageNumber - 1}
            pageSize={pageSize}
            onPageSizeChange={changePageSize}
            onCurrentPageChange={changePageNumber}
            totalCount={itemsCount}
          />

          {expandable &&
          <RowDetailState onExpandedRowsChange={this.changeExpandedDetails} />}

          <TableView
            tableCellTemplate={templateCell}
          />
          <TableHeaderRow allowSorting={allowSorting} />

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
  sorting: PropTypes.array,
  changeSorting: PropTypes.func,
  allowSorting: PropTypes.bool,
  changePageSize: PropTypes.func,
  changePageNumber: PropTypes.func,
};


export default withStyles(styleSheet, { name: 'PaginatedList' })(PaginatedList);
