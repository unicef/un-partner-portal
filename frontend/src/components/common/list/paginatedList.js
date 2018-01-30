import React, { Component } from 'react';
import { Grid, TableView, TableHeaderRow, TableRowDetail, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import { withStyles } from 'material-ui/styles';
import { PagingState, SortingState, RowDetailState } from '@devexpress/dx-react-grid';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import {
  TableRow as TableRowMUI,
} from 'material-ui/Table';
import ListLoader from './listLoader';


const table = {
  allowedPageSizes: [5, 10, 15],
};

const styleSheet = (theme) => {
  const paddingSmall = theme.spacing.unit * 2;
  const paddingBig = theme.spacing.unit * 3;
  return {
    container: {
      padding: `${paddingSmall}px 0 ${paddingSmall}px ${paddingBig}px`,
    },
  };
};

class PaginatedList extends Component {
  constructor(props) {
    super(props);
    this.changeExpandedDetails = expandedRows => this.setState({ expandedRows });
    this.tableRowTemplate = this.tableRowTemplate.bind(this);
  }

  navigationHeader() {
    const { classes, itemsCount = 0, pageSize, pageNumber } = this.props;
    const firstRange = (pageSize * (pageNumber - 1)) + 1;
    const secondTmp = (pageSize * (pageNumber));
    const secondRange = secondTmp > itemsCount ? itemsCount : secondTmp;
    return (<div className={classes.container}><Typography type="title">
      {`${isNaN(firstRange) ? 0 : firstRange}-${isNaN(secondRange) ? 0 : secondRange} of ${itemsCount} results`}
    </Typography></div>);
  }

  changeSorting(sorting) {
    this.setState({
      sorting,
    });
  }

  tableRowTemplate({ row, children }) {
    return (
      <TableRowMUI
        hover
        style={{ cursor: this.props.clickableRow ? 'pointer' : 'auto' }}
        onClick={() => { if (this.props.clickableRow) this.props.onTableRowClick(row); }}
      >
        {children}
      </TableRowMUI>
    );
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
            totalCount={itemsCount || 0}
          />

          {expandable &&
          <RowDetailState onExpandedRowsChange={this.changeExpandedDetails} />}

          <TableView
            tableCellTemplate={templateCell}
            table
            tableRowTemplate={this.tableRowTemplate}
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
  itemsCount: PropTypes.number.isRequired,
  items: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  templateCell: PropTypes.func,
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
  onTableRowClick: PropTypes.func,
  clickableRow: PropTypes.bool,
};


export default withStyles(styleSheet, { name: 'PaginatedList' })(PaginatedList);
